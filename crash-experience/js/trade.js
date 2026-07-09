/* trade.js — トレード画面: エンジンとUIの結線 */
CX.trade = (function () {
  const E = CX.engine;
  const $ = CX.$;
  let activeTab = 'pos';
  let osSide = 1, osSize = 1, osStop = 0;

  /* ---------- セッション開始 ---------- */
  async function open(sc, symbolCode, symbolMeta) {
    const S = await E.start(sc, symbolCode, symbolMeta);
    CX.chart.init(S.anonym ? S.anonymBase : null, 1);
    document.querySelectorAll('.tf-btn').forEach(x => x.classList.toggle('active', x.dataset.tf === '1'));
    CX.nav('trade');
    $('tr-symbol').textContent = S.anonym ? '銘柄X' : S.symbolName;
    $('tr-speed').textContent = S.speed + 'x';
    $('tr-play').textContent = '⏸';
    $('margin-banner').classList.add('hidden');
    activeTab = 'pos';
    switchTab('pos');
    // 助走の頭出し: 最初の60本を即描画してから再生開始
    const warm = Math.min(60, S.bars.length - 1);
    S.idx = warm;
    CX.chart.setHistory(S.bars, warm);
    render();
    E.play();
  }

  /* ---------- 描画 ---------- */
  function render() {
    const S = E.S;
    if (!S) return;
    const snap = E.snapshot();
    const b = snap.bar;
    $('tr-clock').textContent = CX.fmtTime(b[0], S.anonym ? S.anonymBase : null);
    $('ac-equity').textContent = CX.yen(snap.equity);
    const r = $('ac-ratio');
    if (snap.ratio === Infinity) { r.textContent = '—'; r.className = 'num'; }
    else {
      r.textContent = Math.round(snap.ratio) + '%';
      r.className = 'num' + (snap.ratio < 100 ? ' danger' : snap.ratio < 200 ? ' warn' : '');
    }
    const u = $('ac-upl');
    u.textContent = CX.yen(snap.upl, true);
    u.className = 'num ' + CX.pnlClass(snap.upl);
    $('ac-life').textContent = snap.upl < -1000 ? CX.translateLoss(snap.upl) + ' が消えています' : '';
    renderPositions(snap);
  }

  function renderPositions(snap) {
    const S = E.S;
    $('pos-count').textContent = S.positions.length;
    $('hist-count').textContent = S.history.length;
    if (activeTab === 'pos') {
      const el = $('pos-list');
      if (!S.positions.length) { el.innerHTML = '<div class="empty-note">建玉はありません</div>'; return; }
      el.innerHTML = snap.posPnls.map(({ pos, pnl }) => `
        <div class="pos-row">
          <div class="r1">
            <span class="pos-side ${pos.side === 1 ? 'long' : 'short'}">${pos.side === 1 ? '買' : '売'} ${pos.size}枚</span>
            <span class="pos-pnl num ${CX.pnlClass(pnl)}">${CX.yen(pnl, true)}</span>
          </div>
          <div class="r2">
            <span>建値 <span class="num">${CX.px(pos.entry)}</span></span>
            <span>LC <span class="num" style="color:var(--red)">${CX.px(pos.losscut)}</span>${pos.opt > 0 ? ' <span style="color:var(--amber)">任意+' + CX.comma(pos.opt / 10000) + '万</span>' : ''}</span>
            <span>${pos.stop != null ? '逆指値 <span class="num">' + CX.px(pos.stop) + '</span>' : '<span style="color:var(--red)">損切りなし</span>'}</span>
          </div>
          <div class="r3">
            <button class="mini-btn close" data-close="${pos.id}">決済</button>
            <button class="mini-btn" data-stop1="${pos.id}">逆指値−1%</button>
            <button class="mini-btn" data-opt="${pos.id}">LC変更+10万</button>
            ${pos.stop != null ? `<button class="mini-btn" data-stopclear="${pos.id}">解除</button>` : ''}
          </div>
        </div>`).join('');
    } else {
      const el = $('hist-list');
      if (!S.history.length) { el.innerHTML = '<div class="empty-note">履歴はありません</div>'; return; }
      el.innerHTML = [...S.history].reverse().map(h => `
        <div class="hist-row">
          <span>${h.side === 1 ? '買' : '売'}${h.size} ${reasonLabel(h.reason)}</span>
          <span class="num ${CX.pnlClass(h.pnl)}">${CX.yen(h.pnl, true)}</span>
        </div>`).join('');
    }
  }
  function reasonLabel(r) {
    return { manual: '決済', stop: '逆指値', losscut: '<b style="color:var(--red)">ロスカット</b>' }[r] || r;
  }

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.pos-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    $('pos-list').classList.toggle('hidden', tab !== 'pos');
    $('hist-list').classList.toggle('hidden', tab !== 'hist');
    renderPositions(E.snapshot());
  }

  /* ---------- 注文シート ---------- */
  function openSheet(side) {
    const S = E.S;
    if (!S || S.ended || S.halt) return;
    if (S.ghost) return CX.toast('あなたの手は、届かない');
    E.pause();
    $('tr-play').textContent = '▶';
    osSide = side; osSize = 1; osStop = 0;
    const t = $('os-title');
    t.textContent = side === 1 ? '買 新規注文（ASK）' : '売 新規注文（BID）';
    t.className = 'os-title ' + (side === 1 ? 'buy' : 'sell');
    document.querySelectorAll('.stop-opt').forEach(b => b.classList.toggle('active', +b.dataset.stop === 0));
    updateSheet();
    $('order-sheet').classList.remove('hidden');
  }
  function updateSheet() {
    const S = E.S;
    const b = S.bars[S.idx];
    const price = osSide === 1 ? b[8] : b[4];
    const mx = E.maxSize(osSide);
    if (osSize > Math.max(1, mx)) osSize = Math.max(1, mx);
    $('os-size').textContent = osSize;
    $('os-margin').textContent = CX.yen(price * E.MULT * osSize / S.lev);
    $('os-max').textContent = mx + '枚';
    const lc = osSide === 1 ? price * (1 - S.lcWidthPct) : price * (1 + S.lcWidthPct);
    $('os-stop-px').textContent =
      'ロスカットレート(自動設定): ' + CX.px(lc) +
      (osStop ? ' ／ 逆指値: ' + CX.px(osSide === 1 ? price * (1 - osStop) : price * (1 + osStop)) : '');
  }
  function submitOrder() {
    const r = E.order(osSide, osSize, osStop);
    if (r.err) { CX.toast(r.err, 'bad'); return; }
    $('order-sheet').classList.add('hidden');
    CX.toast((osSide === 1 ? '買 ' : '売 ') + osSize + '枚 約定 ' + CX.px(r.price));
    CX.chart.refreshLines(E.S.positions);
    render();
    E.play();
    $('tr-play').textContent = '⏸';
  }

  /* ---------- エンジンコールバック ---------- */
  let barCount = 0;
  E.on.bar = function (b) {
    if (CX.story && CX.story.isJumping()) return;
    CX.chart.push(b);
    // 高速再生時はDOM更新を間引く（4バーに1回）
    if (E.S.speed >= 3600 && (++barCount % 4)) return;
    render();
  };
  E.on.trade = function () {
    CX.chart.refreshLines(E.S.positions);
    CX.chart.setTrades(E.S);
    render();
  };
  E.on.gap = function (info) {
    if (CX.story && CX.story.isJumping()) return;
    E.pause();
    const weekend = info.dt >= 20 * 3600000;
    $('sleep-title').textContent = weekend ? '週末 — 市場クローズ' : '取引時間終了';
    let sub = info.hasPositions
      ? '建玉は' + (weekend ? '週末をはさんで' : '翌営業日へ') + '持ち越されます。'
      : '建玉なし。' + (weekend ? '週明けの寄付きを待ちます。' : '翌営業日の寄付きを待ちます。');
    if (info.marginCall) {
      sub += '<br><br><span style="color:var(--amber)">取引終了時点の判定で 追加証拠金 ' +
        CX.yen(info.marginCall.amount) + ' が発生しました。<br>期限は翌営業日 午前3:00。未解消なら全建玉が強制決済されます。</span>';
    }
    $('sleep-sub').innerHTML = sub;
    $('sleep-tap').textContent = 'タップして翌営業日へ';
    const ov = $('ov-sleep');
    ov.classList.remove('hidden');
    if (!info.hasPositions) setTimeout(() => { if (!ov.classList.contains('hidden')) resumeSleep(); }, 1400);
  };
  function resumeSleep() {
    $('ov-sleep').classList.add('hidden');
    const gap = CX.engine.resumeGap();
    $('tr-play').textContent = '⏸';
    render();
    // 200pt以上の大きな窓のときだけ通知（小さな窓は無視）
    if (gap && Math.abs(gap.pts) >= 200) {
      CX.notify(gap.pnl < 0 ? 'exec' : 'entry', '窓が開きました',
        '寄付きが ' + (gap.pts > 0 ? '+' : '') + Math.round(gap.pts) + 'pt 飛びました｜評価損益 ' + CX.yen(gap.pnl, true), 3200);
      if (gap.pnl < 0) { $('phone').classList.add('shake'); setTimeout(() => $('phone').classList.remove('shake'), 550); }
    }
  }
  let mcNotified = null;
  E.on.margincall = function (mc) {
    const bn = $('margin-banner');
    if (mc) {
      const S = E.S;
      const deadline = CX.fmtTime(mc.deadline, S.anonym ? S.anonymBase : null);
      bn.textContent = '⚠ 追加証拠金 ' + CX.yen(mc.amount) + ' 発生中 — 期限 ' + deadline + '（決済または入金で解消／新規注文不可）';
      bn.classList.remove('hidden');
      if (mcNotified !== mc.raisedT) {
        mcNotified = mc.raisedT;
        CX.notify('exec', '追加証拠金発生のお知らせ', '不足額 ' + CX.yen(mc.amount) + '｜期限 ' + deadline, 3600);
      }
    } else {
      bn.classList.add('hidden');
    }
  };
  E.on.losscut = function (info) {
    const isFc = info.kind === 'force_close';
    const ov = $('ov-losscut');
    ov.querySelector('.ov-kicker').textContent = isFc ? '追加証拠金 期限超過' : 'ロスカットレート到達';
    ov.querySelector('.ov-big').textContent = isFc ? '全建玉強制決済' : 'ロスカット執行';
    const label = info.items.map(x => (x.side === 1 ? '買' : '売') + x.size + '枚').join('・');
    $('lc-detail').innerHTML =
      (isFc ? '追証が解消されなかったため、全建玉が強制決済されました。' : label + ' がロスカットされました。') +
      '<br>確定損失 <b style="color:#ff5d52">' + CX.yen(info.total, true) + '</b>' +
      (CX.translateLoss(info.total) ? '<br>' + CX.translateLoss(info.total) : '');
    ov.classList.remove('hidden');
    $('phone').classList.add('shake');
    setTimeout(() => $('phone').classList.remove('shake'), 550);
  };
  E.on.phase = function (ph) { $('tr-speed').textContent = E.S.speed + 'x'; };
  E.on.end = function (result) {
    if (CX.story && CX.story.isActive()) return; // 追体験はストーリー側が終幕を制御
    CX.chart.destroy();
    CX.result.show(result);
  };

  /* ---------- イベント結線 ---------- */
  function bind() {
    $('btn-buy') && $('btn-buy').addEventListener('click', () => openSheet(1));
    $('btn-sell') && $('btn-sell').addEventListener('click', () => openSheet(-1));
    $('os-cancel').addEventListener('click', () => { $('order-sheet').classList.add('hidden'); E.play(); $('tr-play').textContent = '⏸'; });
    $('os-submit').addEventListener('click', submitOrder);
    document.querySelectorAll('.stepper button').forEach(b =>
      b.addEventListener('click', () => { osSize = Math.max(1, osSize + (+b.dataset.d)); updateSheet(); }));
    document.querySelectorAll('.stop-opt').forEach(b =>
      b.addEventListener('click', () => {
        osStop = +b.dataset.stop;
        document.querySelectorAll('.stop-opt').forEach(x => x.classList.toggle('active', x === b));
        updateSheet();
      }));
    $('tr-play').addEventListener('click', () => {
      const S = E.S;
      if (!S || S.ended || S.halt) return;
      // 追体験: リプレイ中だけ一時停止/再生できる（ノベル表示中は再生させない＝タイミングずれ防止）
      if (CX.story && CX.story.isActive() && !CX.story.isReplaying()) return;
      if (S.playing) { E.pause(); $('tr-play').textContent = '▶'; }
      else { E.play(); $('tr-play').textContent = '⏸'; }
    });
    $('tr-speed').addEventListener('click', () => {
      if (E.S && E.S.ghost) return; // 追体験は速度もスクリプト制御
      $('tr-speed').textContent = E.cycleSpeed() + 'x';
    });
    $('tr-quit').addEventListener('click', () => {
      if (CX.story && CX.story.isActive()) {
        if (confirm('追体験を中断しますか？')) CX.story.abort();
        return;
      }
      if (confirm('セッションを中断しますか？（成績は記録されません）')) {
        E.destroy(); CX.chart.destroy(); CX.nav('home');
      }
    });
    document.querySelectorAll('.tf-btn').forEach(b =>
      b.addEventListener('click', () => {
        if (E.S && E.S.ghost) return; // 追体験は1時間足固定
        document.querySelectorAll('.tf-btn').forEach(x => x.classList.toggle('active', x === b));
        CX.chart.setTf(+b.dataset.tf, E.S.bars, E.S.idx);
      }));
    document.querySelectorAll('.pos-tab').forEach(b =>
      b.addEventListener('click', () => switchTab(b.dataset.tab)));
    $('pos-list').addEventListener('click', e => {
      if (E.S && E.S.ghost) { CX.toast('あなたの手は、届かない'); return; }
      const c = e.target.dataset.close, s1 = e.target.dataset.stop1, sc = e.target.dataset.stopclear, op = e.target.dataset.opt;
      if (op) {
        const r = E.addOptMargin(+op, 100000);
        if (r.err) CX.toast(r.err, 'bad');
        else CX.toast('任意証拠金 +10万円 — ロスカットレート ' + CX.px(r.losscut));
        CX.chart.refreshLines(E.S.positions); render();
        return;
      }
      if (c) {
        const pnl = E.closePosition(+c, 'manual');
        CX.toast('決済 ' + CX.yen(pnl, true), pnl < 0 ? 'bad' : 'good');
        CX.chart.refreshLines(E.S.positions); render();
      } else if (s1) {
        const pos = E.S.positions.find(p => p.id === +s1);
        if (pos) {
          const b = E.S.bars[E.S.idx];
          const px = pos.side === 1 ? b[4] * 0.99 : b[8] * 1.01;
          E.setStop(pos.id, px);
          CX.chart.refreshLines(E.S.positions); render();
        }
      } else if (sc) {
        E.setStop(+sc, null);
        CX.chart.refreshLines(E.S.positions); render();
      }
    });
    $('ov-sleep').addEventListener('click', resumeSleep);
    $('ov-losscut').addEventListener('click', () => {
      $('ov-losscut').classList.add('hidden');
      // 追体験ではリプレイ目標(stopAt)があるときだけ再開（ノベル中に勝手に走らせない）
      if (E.S && !E.S.ended && (!E.S.ghost || E.S.stopAt)) { E.play(); $('tr-play').textContent = '⏸'; }
    });
  }

  return { open, bind, render };
})();
