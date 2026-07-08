/* engine.js — 再生・約定・証拠金・ロスカット・追証・反実仮想
   GMOクリック証券CFDの実ルールを再現:
   - セーフティバルブシステム(S.V.S): 建玉ごとにロスカットレート（約定価格∓ロスカット幅）。
     到達で該当建玉のみ成行決済。任意証拠金の追加でレートを遠ざけられる
   - 追加証拠金(追証): 毎営業日の取引終了時点で証拠金維持率100%未満 → 追証発生。
     期限 = 翌営業日 午前3:00（実装上は取引終了時刻+21時間で近似）。
     未解消なら全建玉強制決済。発生中は新規注文不可
   - 銘柄仕様: 株価指数レバ10倍・商品20倍。日本225=価格×10円 /
     米国NQ100=価格×1ドル(円換算・シナリオ固定USDJPY) / 同ミニ=×0.1ドル
   ※ロスカット幅の実値は非公開(毎週金曜更新)のため既定 約定価格の5% で近似（シナリオで変更可）

   bar = [t, bo, bh, bl, bc, ao, ah, al, ac]  (1=BID始 2=BID高 3=BID安 4=BID終 5=ASK始 6=ASK高 7=ASK安 8=ASK終) */
CX.engine = (function () {

  const LEV = { index: 10, commodity: 20 };
  const GAP_MS = 30 * 60000;             // 30分以上のバー欠損 = 取引終了(セッションブレイク)
  const DAY_MS = 86400000;
  const mcDeadlineOf = t => Math.floor(t / DAY_MS) * DAY_MS + 27 * 3600000; // 追証期限 = 翌日 午前3:00(JST)
  const BANKRUPT_PCT = 0.10;             // 純資産が初期の10%未満で退場（アプリ独自のゲームルール）
  const SPEEDS = [60, 300, 600, 3600];

  let S = null;
  const on = {};  // UI callbacks: bar, gap, losscut, margincall, end, trade, phase

  /* ---------- セッション開始 ---------- */
  async function start(sc, symbolCode, symbolMeta) {
    const from = CX.parseIso(sc.phases.warmup.from);
    const to = CX.parseIso(sc.phases.epilogue.to);
    const bars = await CX.db.getBars(symbolCode, from, to);
    if (bars.length < 100) throw new Error('データ不足: この期間のバーが ' + bars.length + ' 本しかありません');
    const p = CX.profile.get();
    const initial = sc.ghost && sc.initial ? sc.initial            // 追体験: 口座は物語の人物のもの
      : (p && p.save) ? p.save * 10000 : 1000000;
    const spec = CX.importer.KNOWN[symbolCode] || { unit: 10, ccy: 'JPY', cat: 'index' };
    const fx = spec.ccy === 'USD' ? (sc.fx || 150) : 1;
    S = {
      ghost: !!sc.ghost,
      sc, symbol: symbolCode, symbolName: symbolMeta.name,
      lev: LEV[spec.cat] || 10,
      mul: (spec.unit != null ? spec.unit : 10) * fx,   // 1枚1ポイントあたりの円損益
      fx, lcWidthPct: sc.lcWidthPct || 0.05,
      bars, idx: 0,
      playing: false, halt: null, speed: sc.phases.warmup.speed, accum: 0, raf: null, lastTick: 0,
      balance: initial, initial, positions: [], nextId: 1,
      marginCall: null,                                  // {amount, raisedT, deadline}
      history: [], entriesLog: [], events: [],
      nanpin: 0, slipped: false, minRatio: Infinity, peakEquity: initial, maxDD: 0,
      phase: 'warmup', anonym: sc.anonymize !== false, anonymBase: bars[0][0],
      ended: false
    };
    return S;
  }

  /* ---------- 価格・口座ヘルパー ---------- */
  const cur = () => S.bars[S.idx];
  const inCrash = () => S.phase === 'crash';
  const slipOf = b => (S.ghost || !inCrash()) ? 0 : (b[2] - b[3]) * 0.3; // 追体験は決定的（ドライラン一致）

  function posPnl(pos, b) {
    return (pos.side === 1 ? (b[4] - pos.entry) : (pos.entry - b[8])) * S.mul * pos.size;
  }
  function unrealized(b) { return S.positions.reduce((a, p) => a + posPnl(p, b), 0); }
  function requiredMargin(b) { // 必要証拠金（任意証拠金は含めない）
    const mid = (b[4] + b[8]) / 2;
    return S.positions.reduce((a, p) => a + mid * S.mul * p.size, 0) / S.lev;
  }
  function optTotal() { return S.positions.reduce((a, p) => a + p.opt, 0); }
  function equity(b) { return S.balance + unrealized(b); } // 時価評価総額
  function marginRatio(b) {
    const rm = requiredMargin(b);
    return rm > 0 ? equity(b) / rm * 100 : Infinity;
  }
  function available(b) { return equity(b) - requiredMargin(b) - optTotal(); } // 発注余力

  /* ---------- ロスカットレート (S.V.S) ---------- */
  function lcRateOf(pos) {
    const w = pos.entry * S.lcWidthPct + pos.opt / (S.mul * pos.size);
    return pos.side === 1 ? pos.entry - w : pos.entry + w;
  }

  /* ---------- 発注 ---------- */
  function maxSize(side) {
    const b = cur();
    const price = side === 1 ? b[8] : b[4];
    return Math.max(0, Math.floor(available(b) / (price * S.mul / S.lev)));
  }
  function order(side, size, stopPct) {
    if (S.ended || S.halt) return { err: '現在は発注できません' };
    if (S.marginCall) return { err: '追加証拠金 発生中のため新規注文はできません（決済または入金で解消）' };
    const b = cur();
    const slip = slipOf(b);
    const price = side === 1 ? b[8] + slip : b[4] - slip;
    const needed = price * S.mul * size / S.lev;
    if (needed > available(b)) return { err: '証拠金不足です（発注可能: ' + maxSize(side) + '枚）' };
    if (S.positions.some(p => p.side === side && posPnl(p, b) < 0)) S.nanpin++;
    const stop = stopPct ? (side === 1 ? price * (1 - stopPct) : price * (1 + stopPct)) : null;
    const pos = { id: S.nextId++, side, size, entry: price, stop, opt: 0, tOpen: b[0] };
    pos.losscut = lcRateOf(pos);
    S.positions.push(pos);
    S.entriesLog.push({ idx: S.idx, side, size, hadStop: !!stop });
    if (on.trade) on.trade();
    return { ok: true, price, losscut: pos.losscut };
  }
  function setStop(id, stop) {
    const p = S.positions.find(x => x.id === id);
    if (p) p.stop = stop;
    if (on.trade) on.trade();
  }
  /* 任意証拠金の追加/解除 → ロスカットレート変更（GMOの「ロスカットレート変更」に相当） */
  function addOptMargin(id, amount) {
    const p = S.positions.find(x => x.id === id);
    if (!p) return { err: '建玉がありません' };
    if (amount > 0 && amount > available(cur())) return { err: '取引余力が足りません' };
    if (p.opt + amount < 0) amount = -p.opt;
    p.opt += amount;
    p.losscut = lcRateOf(p);
    if (on.trade) on.trade();
    return { ok: true, losscut: p.losscut, opt: p.opt };
  }
  /* 入金（追体験モードの追証入金イベント用） */
  function deposit(amount) {
    S.balance += amount;
    checkMcResolved();
    if (on.trade) on.trade();
  }
  function closePosition(id, reason, fillOverride) {
    const i = S.positions.findIndex(x => x.id === id);
    if (i < 0) return;
    const pos = S.positions[i];
    const b = cur();
    const slip = slipOf(b) * (reason === 'losscut' || reason === 'force_close' ? 1.5 : 1);
    const fill = fillOverride != null ? fillOverride
      : (pos.side === 1 ? b[4] - slip : b[8] + slip);
    const pnl = (pos.side === 1 ? (fill - pos.entry) : (pos.entry - fill)) * S.mul * pos.size;
    S.balance += pnl;
    S.positions.splice(i, 1);
    S.history.push({ side: pos.side, size: pos.size, entry: pos.entry, exit: fill, pnl, tOpen: pos.tOpen, tClose: b[0], reason });
    checkMcResolved();
    if (on.trade) on.trade();
    return pnl;
  }

  /* ---------- 逆指値（通常注文）の判定 — 窓・滑り込み ---------- */
  function checkStops(b) {
    for (const pos of [...S.positions]) {
      if (pos.stop == null) continue;
      if (pos.side === 1 && b[3] <= pos.stop) {
        let fill = b[1] < pos.stop ? b[1] : pos.stop;
        fill -= slipOf(b);
        if (fill < pos.stop - 1e-9) S.slipped = true;
        closePosition(pos.id, 'stop', fill);
      } else if (pos.side === -1 && b[6] >= pos.stop) {
        let fill = b[5] > pos.stop ? b[5] : pos.stop;
        fill += slipOf(b);
        if (fill > pos.stop + 1e-9) S.slipped = true;
        closePosition(pos.id, 'stop', fill);
      }
    }
  }

  /* ---------- S.V.S ロスカット判定（建玉ごと・窓考慮） ---------- */
  function checkLosscuts(b) {
    const items = [];
    for (const pos of [...S.positions]) {
      let hit = false, fill = 0;
      if (pos.side === 1 && b[3] <= pos.losscut) {
        fill = (b[1] < pos.losscut ? b[1] : pos.losscut) - slipOf(b);
        hit = true;
      } else if (pos.side === -1 && b[6] >= pos.losscut) {
        fill = (b[5] > pos.losscut ? b[5] : pos.losscut) + slipOf(b);
        hit = true;
      }
      if (hit) {
        const pnl = closePosition(pos.id, 'losscut', fill);
        items.push({ side: pos.side, size: pos.size, fill, pnl });
      }
    }
    if (items.length) {
      const total = items.reduce((a, x) => a + x.pnl, 0);
      S.events.push({ type: 'losscut', t: b[0], pnl: total, n: items.length });
      pause();
      if (on.losscut) on.losscut({ kind: 'losscut', items, total });
    }
  }

  /* ---------- 追証（取引終了時判定・期限超過で全玉強制決済） ---------- */
  function raiseMarginCallIfNeeded(sessionEndBar) {
    if (S.marginCall || !S.positions.length) return;
    const eq = equity(sessionEndBar), rm = requiredMargin(sessionEndBar);
    if (eq < rm) {
      S.marginCall = { amount: Math.ceil(rm - eq), raisedT: sessionEndBar[0], deadline: mcDeadlineOf(sessionEndBar[0]) };
      S.events.push({ type: 'margin_call', t: sessionEndBar[0], amount: S.marginCall.amount });
      if (on.margincall) on.margincall(S.marginCall);
    }
  }
  function checkMcResolved() {
    if (!S.marginCall) return;
    const b = cur();
    if (!S.positions.length || equity(b) >= requiredMargin(b)) {
      S.marginCall = null;
      S.events.push({ type: 'margin_call_resolved', t: b[0] });
      if (on.margincall) on.margincall(null);
    }
  }
  function checkMcDeadline(b) {
    if (!S.marginCall) return;
    if (equity(b) >= requiredMargin(b)) { checkMcResolved(); return; }
    if (b[0] >= S.marginCall.deadline && S.positions.length) {
      const items = [];
      let total = 0;
      for (const pos of [...S.positions]) {
        const pnl = closePosition(pos.id, 'force_close');
        items.push({ side: pos.side, size: pos.size, pnl });
        total += pnl;
      }
      S.events.push({ type: 'force_close', t: b[0], pnl: total, n: items.length });
      S.marginCall = null;
      if (on.margincall) on.margincall(null);
      pause();
      if (on.losscut) on.losscut({ kind: 'force_close', items, total });
    }
  }

  /* ---------- フェーズ ---------- */
  function phaseOf(t) {
    const ph = S.sc.phases;
    if (t >= CX.parseIso(ph.epilogue.from)) return 'epilogue';
    if (t >= CX.parseIso(ph.crash.from)) return 'crash';
    return 'warmup';
  }

  /* ---------- 1バー進める ---------- */
  function step() {
    if (S.ended || S.halt) return false;
    const ni = S.idx + 1;
    if (ni >= S.bars.length) { end('finish'); return false; }
    const dt = S.bars[ni][0] - S.bars[S.idx][0];
    if (dt > GAP_MS && !S.skipGap) {
      // 取引終了時点 = 追証判定タイミング
      raiseMarginCallIfNeeded(cur());
      S.halt = 'gap';
      if (on.gap) on.gap({ dt, hasPositions: S.positions.length > 0, marginCall: S.marginCall });
      return false;
    }
    S.skipGap = false;
    S.idx = ni;
    const b = cur();

    const ph = phaseOf(b[0]);
    if (ph !== S.phase) {
      S.phase = ph;
      S.speed = S.sc.phases[ph].speed;
      if (on.phase) on.phase(ph);
    }

    checkStops(b);
    checkLosscuts(b);
    checkMcDeadline(b);

    const eq = equity(b);
    if (eq > S.peakEquity) S.peakEquity = eq;
    S.maxDD = Math.max(S.maxDD, S.peakEquity - eq);
    const ratio = marginRatio(b);
    if (ratio < S.minRatio) S.minRatio = ratio;

    if (!S.ghost && equity(cur()) < S.initial * BANKRUPT_PCT) { if (on.bar) on.bar(b); end('bankrupt'); return false; }

    if (on.bar) on.bar(b);
    if (S.stopAt && b[0] >= S.stopAt) {  // 追体験: 指定時刻で正確に停止
      S.playing = false;
      const cb = S.onStop;
      S.stopAt = null; S.onStop = null;
      if (cb) cb();
      return false;
    }
    return true;
  }

  /* ---------- 窓明け再開 ---------- */
  function resumeGap() {
    if (S.halt !== 'gap') return null;
    const preUpl = unrealized(cur());
    const preClose = cur()[4]; // 窓前の終値(BID)
    S.halt = null;
    S.skipGap = true;
    step();
    const ended = S.ended || S.halt;
    const gapPnl = ended ? 0 : unrealized(cur()) - preUpl;
    const gapPts = ended ? 0 : cur()[1] - preClose; // 窓前終値 → 窓明け始値の値幅
    play();
    return { pnl: gapPnl, pts: gapPts };
  }

  /* ---------- 再生制御 ---------- */
  function loop(now) {
    if (!S || S.ended) return;
    S.raf = requestAnimationFrame(loop);
    if (!S.playing || S.halt) { S.lastTick = now; return; }
    const dtSec = Math.min(0.2, (now - S.lastTick) / 1000);
    S.lastTick = now;
    S.accum += (S.speed / 60) * dtSec;
    let n = Math.floor(S.accum);
    S.accum -= n;
    if (n > 90) n = 90;
    while (n-- > 0) { if (!step()) break; }
  }
  function play() {
    if (S.ended) return;
    S.playing = true;
    S.lastTick = performance.now();
    if (!S.raf) S.raf = requestAnimationFrame(loop);
  }
  function pause() { if (S) S.playing = false; }
  function cycleSpeed() {
    const i = SPEEDS.indexOf(S.speed);
    S.speed = SPEEDS[(i + 1) % SPEEDS.length];
    return S.speed;
  }

  /* ---------- 終了・結果 ---------- */
  function end(reason) {
    if (S.ended) return;
    S.ended = true;
    S.playing = false;
    if (S.raf) { cancelAnimationFrame(S.raf); S.raf = null; }
    const b = cur();
    const finalEquity = equity(b);
    const pnl = finalEquity - S.initial;
    const wins = S.history.filter(h => h.pnl > 0).length;
    const tags = [];
    const noStopEntries = S.entriesLog.filter(e => !e.hadStop).length;
    if (pnl < 0 && noStopEntries >= Math.max(1, S.entriesLog.length / 2)) tags.push('損切り注文なし');
    if (S.nanpin >= 2) tags.push('ナンピン（含み損への追撃 ' + S.nanpin + '回）');
    if (S.minRatio < 200) tags.push('高レバレッジ（維持率最低 ' + Math.max(0, Math.round(S.minRatio)) + '%）');
    if (S.slipped) tags.push('窓・スリッページで逆指値が滑った');
    if (S.events.some(e => e.type === 'losscut')) tags.push('ロスカット執行（建玉ごとS.V.S）');
    if (S.events.some(e => e.type === 'margin_call')) tags.push('追加証拠金 発生');
    if (S.events.some(e => e.type === 'force_close')) tags.push('追証未解消による全建玉強制決済');
    if (reason === 'bankrupt') tags.push('退場（純資産が初期の10%未満）');

    const cf = counterfactual();
    const result = {
      reason, finalEquity, pnl, initial: S.initial,
      maxDD: S.maxDD, minRatio: S.minRatio,
      trades: S.history.length, wins, tags, cf,
      history: S.history, sc: S.sc, symbolName: S.symbolName,
      fromT: S.bars[0][0], toT: b[0], anonym: S.anonym
    };
    if (S.ghost) { if (on.end) on.end(result); return; }  // 追体験は生涯成績に含めない
    const life = CX.life.get();
    life.attempts++;
    if (reason === 'bankrupt') {
      life.bankrupts++;
      const t = new Date(); t.setHours(24, 0, 0, 0);
      life.locks[S.sc.id] = t.getTime();
    }
    if (S.events.some(e => e.type === 'losscut' || e.type === 'force_close')) life.losscuts++;
    if (pnl < life.worstPnl) life.worstPnl = pnl;
    life.hist.unshift({ scId: S.sc.id, title: S.sc.title, date: Date.now(), reason, pnl: Math.round(pnl) });
    life.hist = life.hist.slice(0, 30);
    CX.life.save(life);

    if (on.end) on.end(result);
  }

  /* ---------- 反実仮想: 同じエントリーを2%ルール＋逆指値で ---------- */
  function counterfactual() {
    if (!S.entriesLog.length) return null;
    const bars = S.bars, endIdx = S.idx;
    let eq = S.initial, open = null, peak = eq, maxDD = 0, trades = 0, dead = false;
    const entryByIdx = {};
    for (const e of S.entriesLog) if (!entryByIdx[e.idx]) entryByIdx[e.idx] = e;
    for (let i = 0; i <= endIdx; i++) {
      const b = bars[i];
      if (open) {
        const stopHit = open.side === 1 ? b[3] <= open.stop : b[6] >= open.stop;
        if (stopHit) {
          const fill = open.side === 1 ? Math.min(b[1], open.stop) : Math.max(b[5], open.stop);
          eq += (open.side === 1 ? fill - open.entry : open.entry - fill) * S.mul * open.size;
          open = null; trades++;
        }
      }
      const e = entryByIdx[i];
      if (e && !open) {
        const price = e.side === 1 ? b[8] : b[4];
        const stopDist = price * 0.015;
        let size = Math.floor(eq * 0.02 / (stopDist * S.mul));
        size = Math.min(size, Math.floor(eq * S.lev / (price * S.mul)));
        if (size >= 1) {
          open = { side: e.side, size, entry: price, stop: e.side === 1 ? price - stopDist : price + stopDist };
        }
      }
      const ce = eq + (open ? (open.side === 1 ? b[4] - open.entry : open.entry - b[8]) * S.mul * open.size : 0);
      if (ce > peak) peak = ce;
      maxDD = Math.max(maxDD, peak - ce);
      if (ce < S.initial * BANKRUPT_PCT) { dead = true; break; }
    }
    if (open) {
      const b = bars[endIdx];
      eq += (open.side === 1 ? b[4] - open.entry : open.entry - b[8]) * S.mul * open.size;
      trades++;
    }
    return { finalEquity: eq, pnl: eq - S.initial, maxDD, trades, survived: !dead };
  }

  function destroy() {
    if (S && S.raf) cancelAnimationFrame(S.raf);
    S = null;
  }

  return {
    start, play, pause, step, resumeGap, cycleSpeed,
    order, setStop, addOptMargin, deposit, closePosition, maxSize, destroy,
    on,
    get S() { return S; },
    get MULT() { return S ? S.mul : 10; },
    snapshot() {
      const b = cur();
      return {
        bar: b, equity: equity(b), upl: unrealized(b), ratio: marginRatio(b),
        margin: requiredMargin(b), balance: S.balance, avail: available(b),
        marginCall: S.marginCall,
        posPnls: S.positions.map(p => ({ pos: p, pnl: posPnl(p, b) }))
      };
    }
  };
})();
