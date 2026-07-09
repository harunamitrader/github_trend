/* story.js — 追体験モード: ビート駆動ドライバ ＋ ノベルUI ＋ 履歴/セーブ */
CX.story = (function () {
  const $ = CX.$;
  const E = CX.engine;
  let ST = null; // { story, i, active, jumping, picks[], watch, skipTo, log[] }

  const isActive = () => !!(ST && ST.active);
  const isJumping = () => !!(ST && ST.jumping);
  const isReplaying = () => !!(ST && ST.replaying);
  const saveKey = id => 'cx_save_' + id;

  function hasSave(id) {
    try { const s = JSON.parse(localStorage.getItem(saveKey(id))); return s && s.i > 0 ? s : null; }
    catch (e) { return null; }
  }
  function saveProgress() {
    if (!ST || !ST.active || ST.jumping) return;
    try { localStorage.setItem(saveKey(ST.story.id), JSON.stringify({ i: ST.i, picks: ST.picks })); } catch (e) {}
  }
  function clearSave(id) { try { localStorage.removeItem(saveKey(id)); } catch (e) {} }

  /* ---------- 開始（resume指定で途中から） ---------- */
  async function start(story, resume) {
    const metas = await CX.db.getSymbols();
    const meta = metas.find(m => m.code === story.symbol);
    if (!meta) return CX.toast('データ未取込: ' + story.dataNeed.label, 'bad');
    let S;
    try { S = await E.start(story.scenario, story.symbol, meta); }
    catch (e) { return CX.toast(e.message, 'bad'); }
    ST = { story, i: 0, active: true, jumping: false, replaying: false, picks: [], watch: null, skipTo: null, log: [] };
    CX.chart.init(null, 1440, { fitAll: true }); // 日足・全体像
    document.querySelector('.tf-row').style.display = '';
    CX.nav('trade');
    $('tr-symbol').textContent = meta.name;
    $('tr-speed').textContent = S.speed + 'x';
    $('tr-play').textContent = '▶';
    $('tr-play').classList.add('hidden'); // 再生ボタンはリプレイ中だけ表示（ノベル中は出さない）
    $('margin-banner').classList.add('hidden');
    $('tr-skip').onclick = doSkip;
    $('tr-log').classList.remove('hidden');
    $('tr-log').onclick = openLog;
    CX.chart.setHistory(S.bars, S.idx);
    CX.trade.render();
    E.pause();
    if (resume && resume.i > 0) fastForward(resume.i, resume.picks || []);
    next();
  }

  /* ---------- 途中セーブからの高速再構築（表示なしでビートを適用） ---------- */
  function fastForward(target, savedPicks) {
    ST.jumping = true;
    let pk = 0;
    while (ST.i < target) {
      const b = ST.story.beats[ST.i++];
      if (!b) break;
      switch (b.type) {
        case 'novel': logLines(b.lines, 'novel'); break;
        case 'thought': logLines([b.text], 'thought'); break;
        case 'dark': logLines(b.lines, 'dark'); break;
        case 'card': logCard(b); break;
        case 'choice': {
          const idx = savedPicks[pk] != null ? savedPicks[pk] : 0;
          pk++;
          ST.picks.push(idx);
          logChoice(b, idx);
          logLines(b.options[idx].reply, 'novel');
          break;
        }
        case 'buy': doBuy(b, true); break;
        case 'opt': doOpt(b, true); break;
        case 'deposit': doDeposit(b, true); break;
        case 'replay': jumpEngineTo(CX.parseIso(b.to)); break;
        case 'jump': jumpEngineTo(typeof b.t === 'number' ? b.t : CX.parseIso(b.to)); break;
        case 'end': ST.i--; target = ST.i; break; // 終端に達したら止める
      }
    }
    ST.jumping = false;
    CX.chart.setHistory(E.S.bars, E.S.idx);
    CX.chart.refreshLines(E.S.positions);
    CX.chart.setTrades(E.S);
    CX.trade.render();
    CX.toast('つづきから再開します');
  }

  /* エンジンだけ目標時刻まで進める（描画なし・fastForward/skip用） */
  function jumpEngineTo(to) {
    const S = E.S;
    let guard = 0;
    while (S.bars[S.idx] && S.bars[S.idx][0] < to && guard++ < 300000 && !S.ended) {
      if (S.halt === 'gap') { S.halt = null; S.skipGap = true; E.step(); }
      else if (!E.step() && S.halt !== 'gap') break;
    }
  }

  /* ---------- スキップ（山場以外のリプレイを飛ばす） ---------- */
  function doSkip() {
    if (!ST || !ST.active || !ST.skipTo) return;
    const to = ST.skipTo;
    const S = E.S;
    const cb = S.onStop;
    S.stopAt = null; S.onStop = null;
    ST.skipTo = null;
    $('tr-skip').classList.add('hidden');
    E.pause();
    ST.jumping = true;
    jumpEngineTo(to);
    ST.jumping = false;
    $('ov-sleep').classList.add('hidden');
    CX.chart.setHistory(S.bars, S.idx);
    CX.chart.refreshLines(S.positions);
    CX.chart.setTrades(S);
    CX.trade.render();
    if (cb) cb();
  }

  function abort() {
    if (ST && ST.watch) clearInterval(ST.watch);
    saveProgress(); // 中断時点を保存（続きから再開できる）
    hideAll();
    $('tr-log').classList.add('hidden');
    ST = null;
    E.destroy();
    CX.chart.destroy();
    CX.nav('home');
  }

  function hideAll() {
    ['story-window', 'story-dark', 'story-card', 'story-choice', 'story-log', 'tr-skip', 'tr-play'].forEach(id => $(id).classList.add('hidden'));
  }

  /* ---------- 履歴（バックログ） ---------- */
  const fmtLine = s => s.replace(/\*\*(.+?)\*\*/g, '<b class="sw-em">$1</b>').replace(/\n/g, '<br>');
  function logLines(lines, cls) { for (const l of lines) ST.log.push({ cls, html: fmtLine(l) }); }
  function logCard(b) { ST.log.push({ cls: 'card', html: b.date + '　' + b.title + '　' + b.sub }); }
  function logChoice(b, idx) { ST.log.push({ cls: 'choice', html: '【選択】' + b.prompt + ' → ' + b.options[idx].label }); }

  function openLog() {
    const body = $('slog-body');
    body.innerHTML = ST.log.length
      ? ST.log.map(e => `<div class="slog-item slog-${e.cls}">${e.html}</div>`).join('')
      : '<div class="slog-empty">まだ記録はありません</div>';
    $('story-log').classList.remove('hidden');
    body.scrollTop = body.scrollHeight; // 最新（今読んでいる所）が見える位置から
  }
  function closeLog() { $('story-log').classList.add('hidden'); }

  /* ---------- ビート実行 ---------- */
  function next() {
    if (!ST || !ST.active) return;
    saveProgress(); // 各ビートの直前で進捗を保存
    const b = ST.story.beats[ST.i++];
    if (!b) return finish();
    switch (b.type) {
      case 'novel': logLines(b.lines, 'novel'); return showLines(b.lines, 'novel', next);
      case 'thought': logLines([b.text], 'thought'); return showLines([b.text], 'thought', next);
      case 'dark': logLines(b.lines, 'dark'); return showDark(b.lines, next);
      case 'card': logCard(b); return showCard(b, next);
      case 'choice': return showChoice(b, next);
      case 'buy': doBuy(b); return next();
      case 'opt': doOpt(b); return next();
      case 'deposit': doDeposit(b); return next();
      case 'replay': return runReplay(b, next);
      case 'jump': doJump(b); return next();
      case 'end': return finish();
      default: return next();
    }
  }

  /* ---------- ノベルウィンドウ ---------- */
  function showLines(lines, cls, cb) {
    const w = $('story-window');
    const tx = $('sw-text');
    let i = 0;
    w.className = 'story-window ' + cls;
    const show = () => {
      tx.innerHTML = fmtLine(lines[i]);
      tx.classList.remove('sw-anim'); void tx.offsetWidth; tx.classList.add('sw-anim');
    };
    w.classList.remove('hidden');
    show();
    w.onclick = () => {
      i++;
      if (i < lines.length) show();
      else { w.classList.add('hidden'); w.onclick = null; cb(); }
    };
  }

  function showDark(lines, cb) {
    const d = $('story-dark');
    const tx = $('sd-text');
    let i = 0;
    const show = () => {
      tx.innerHTML = fmtLine(lines[i]);
      tx.classList.remove('sw-anim'); void tx.offsetWidth; tx.classList.add('sw-anim');
    };
    d.classList.remove('hidden');
    show();
    d.onclick = () => {
      i++;
      if (i < lines.length) show();
      else { d.classList.add('hidden'); d.onclick = null; cb(); }
    };
  }

  function showCard(b, cb) {
    const c = $('story-card');
    c.innerHTML = `<div class="stc-date">${b.date}</div><div class="stc-title mincho">${b.title}</div><div class="stc-sub mincho">${b.sub}</div>`;
    c.classList.remove('hidden');
    setTimeout(() => { c.classList.add('hidden'); cb(); }, 2200);
  }

  function showChoice(b, cb) {
    const c = $('story-choice');
    c.querySelector('.os-title').textContent = b.prompt;
    const box = c.querySelector('.stch-opts');
    box.innerHTML = '';
    b.options.forEach((op, idx) => {
      const btn = document.createElement('button');
      btn.className = 'primary-btn stch-btn';
      btn.textContent = op.label;
      btn.onclick = () => {
        ST.picks.push(idx);
        logChoice(b, idx);
        logLines(op.reply, 'novel');
        c.classList.add('hidden');
        showLines(op.reply, 'novel', cb);
      };
      box.appendChild(btn);
    });
    c.classList.remove('hidden');
  }

  /* ---------- 売買・入金（silent=履歴再構築時は通知しない） ---------- */
  function doBuy(b, silent) {
    const r = E.order(1, b.size, null);
    if (r.err) { if (!silent) CX.toast(r.err, 'bad'); return; }
    if (!silent) {
      CX.notify('entry', '約定通知 — 新規買', '米国NQ100 買 ' + b.size + '枚 @' + CX.px(r.price) + (b.note ? '｜' + b.note : ''));
      CX.chart.refreshLines(E.S.positions);
      CX.chart.setTrades(E.S);
      CX.trade.render();
    }
  }
  function doOpt(b, silent) {
    const S = E.S;
    if (!S.positions.length) return;
    const target = S.positions.reduce((a, p) => (a == null || p.id < a.id) ? p : a, null);
    const amount = Math.min(b.amount, Math.max(0, Math.floor(E.snapshot().avail)));
    if (amount <= 0) return;
    const r = E.addOptMargin(target.id, amount);
    if (r.err) return;
    if (!silent) {
      CX.notify('opt', 'ロスカットレート変更', '任意証拠金 +' + CX.comma(amount) + '円 → LC ' + CX.px(r.losscut));
      CX.chart.refreshLines(S.positions);
      CX.trade.render();
    }
  }
  function doDeposit(b, silent) {
    E.deposit(b.amount);
    if (!silent) {
      CX.notify('deposit', '入金完了', '+' + CX.comma(b.amount) + '円' + (b.note ? '｜' + b.note.replace(/^入金.*?—\s*/, '') : ''));
      CX.trade.render();
    }
  }

  /* ---------- 再生・ジャンプ ---------- */
  function runReplay(b, cb) {
    const to = CX.parseIso(b.to);
    const S = E.S;
    if (S.bars[S.idx][0] >= to) return cb();
    S.speed = b.speed || 600;
    $('tr-speed').textContent = S.speed + 'x';
    ST.replaying = true;
    $('tr-play').textContent = '⏸';
    $('tr-play').classList.remove('hidden'); // リプレイ中は再生/一時停止を許可
    ST.skipTo = b.noskip ? null : to;
    $('tr-skip').classList.toggle('hidden', !ST.skipTo);
    let done = false;
    const fire = () => {
      if (done || !ST || !ST.active) return;
      done = true;
      ST.replaying = false;
      if (ST.watch) { clearInterval(ST.watch); ST.watch = null; }
      ST.skipTo = null;
      $('tr-skip').classList.add('hidden');
      $('tr-play').textContent = '▶';
      $('tr-play').classList.add('hidden'); // ノベルへ戻る間は再生ボタンを隠す
      CX.trade.render();
      cb();
    };
    S.stopAt = to;
    S.onStop = fire;
    E.play();
    ST.watch = setInterval(() => {
      if (!ST || !ST.active) { clearInterval(ST.watch); return; }
      const S2 = E.S;
      if (!S2 || S2.ended) fire();
    }, 300);
  }

  function doJump(b) {
    const to = typeof b.t === 'number' ? b.t : CX.parseIso(b.to);
    ST.jumping = true;
    E.pause();
    jumpEngineTo(to);
    ST.jumping = false;
    $('ov-sleep').classList.add('hidden');
    CX.chart.setHistory(E.S.bars, E.S.idx);
    CX.chart.refreshLines(E.S.positions);
    CX.chart.setTrades(E.S);
    CX.trade.render();
  }

  /* ---------- 終幕 ---------- */
  function finish() {
    if (!ST) return;
    hideAll();
    $('tr-log').classList.add('hidden');
    clearSave(ST.story.id); // クリアしたら「続きから」は消える
    const S = E.S;
    const L = ST.story.lessons;
    const snap = E.snapshot();
    const finalEq = Math.round(snap.equity);
    const invested = L.invested;
    const loss = invested - finalEq;
    const interventions = ST.picks.filter(i => i === 0).length;
    localStorage.setItem('cx_story_' + ST.story.id, JSON.stringify({ at: Date.now(), finalEq }));

    CX.nav('result');
    $('result-body').innerHTML = `
      <div class="res-verdict dead">
        <div class="kicker">${ST.story.subtitle}</div>
        <div class="word dead mincho" style="font-size:40px">−${CX.comma(loss)}円</div>
      </div>
      <div class="res-pnl"><div style="color:var(--dim);font-size:12.5px;line-height:2">
        投入 ${CX.comma(invested)}円（貯金515万＋娘の学資100万）<br>
        41営業日後の残高 <b class="num" style="color:var(--text)">${CX.comma(finalEq)}円</b>
      </div></div>
      <div class="res-life">
        最初のロスカット（2/27・−${CX.comma(L.firstCutLoss)}円）は、市場からの警告でした。<br>
        そこで止まっていれば、損失は <b>−${CX.comma(L.firstCutLoss)}円</b> で終わっていた。<br>
        認めなかった代償は <b>−${CX.comma(loss - L.firstCutLoss)}円</b>。
      </div>
      <div class="res-q">${L.leverageNote}</div>
      <h2 class="sec-label" style="padding:0 16px">彼が破ったルール — あなたが守るルール</h2>
      <div class="res-trades">${L.rules.map(r => `<div class="hist-row" style="display:block;line-height:1.8">・${r}</div>`).join('')}</div>
      <div class="cf-card">
        <div class="cf-title">全トレード（実データ・実ルールで算出）</div>
        ${S.history.map(h => `<div class="hist-row">
          <span>${h.side === 1 ? '買' : '売'}${h.size} ${CX.px(h.entry)}→${CX.px(h.exit)} <span style="color:var(--faint)">${{ manual: '決済', stop: '逆指値', losscut: 'ロスカット', force_close: '追証強制決済' }[h.reason] || ''}</span></span>
          <span class="num ${CX.pnlClass(h.pnl)}">${CX.yen(h.pnl, true)}</span></div>`).join('')}
      </div>
      <div class="res-q mincho">
        あなたは${interventions > 0 ? ` ${interventions} 回、彼を止めようとした。<br>彼には、届かなかった。` : '一度も、彼を止めなかった。'}<br><br>
        あなた自身には——届くだろうか。
      </div>
      <button class="primary-btn res-back" id="res-back">ホームに戻る</button>`;
    $('res-back').addEventListener('click', () => {
      ST = null;
      E.destroy();
      CX.nav('home');
    });
    ST.active = false;
  }

  /* 履歴オーバーレイの閉じるボタン（スクリプトはbody末尾なのでDOMは準備済み） */
  { const c = $('slog-close'); if (c) c.onclick = closeLog; }

  return { start, abort, isActive, isJumping, isReplaying, hasSave, openLog, closeLog };
})();
