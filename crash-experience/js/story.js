/* story.js — 追体験モード: ビート駆動ドライバ ＋ ノベルUI */
CX.story = (function () {
  const $ = CX.$;
  const E = CX.engine;
  let ST = null; // { story, i, active, jumping, picks[], watch }

  const isActive = () => !!(ST && ST.active);
  const isJumping = () => !!(ST && ST.jumping);

  /* ---------- 開始 ---------- */
  async function start(story) {
    const metas = await CX.db.getSymbols();
    const meta = metas.find(m => m.code === story.symbol);
    if (!meta) return CX.toast('データ未取込: ' + story.dataNeed.label, 'bad');
    let S;
    try { S = await E.start(story.scenario, story.symbol, meta); }
    catch (e) { return CX.toast(e.message, 'bad'); }
    ST = { story, i: 0, active: true, jumping: false, picks: [], watch: null, skipTo: null };
    CX.chart.init(null, 1440, { fitAll: true }); // 日足・最初のエントリーからの全体像を常に表示
    document.querySelector('.tf-row').style.display = '';
    CX.nav('trade');
    $('tr-symbol').textContent = meta.name;
    $('tr-speed').textContent = S.speed + 'x';
    $('tr-play').textContent = '▶';
    $('margin-banner').classList.add('hidden');
    $('tr-skip').onclick = doSkip;
    CX.chart.setHistory(S.bars, S.idx);
    CX.trade.render();
    E.pause();
    next();
  }

  /* リプレイのスキップ（山場以外）: 目標時刻まで一気に進める */
  function doSkip() {
    if (!ST || !ST.active || !ST.skipTo) return;
    const to = ST.skipTo;
    const S = E.S;
    const cb = S.onStop;             // runReplayが仕掛けた継続コールバック
    S.stopAt = null; S.onStop = null;
    ST.skipTo = null;
    $('tr-skip').classList.add('hidden');
    E.pause();
    doJump({ to: null, t: to });
    if (cb) cb();
  }

  function abort() {
    if (ST && ST.watch) clearInterval(ST.watch);
    hideAll();
    document.querySelector('.tf-row').style.display = '';
    ST = null;
    E.destroy();
    CX.chart.destroy();
    CX.nav('home');
  }

  function hideAll() {
    ['story-window', 'story-dark', 'story-card', 'story-choice', 'tr-skip'].forEach(id => $(id).classList.add('hidden'));
  }

  /* ---------- ビート実行 ---------- */
  function next() {
    if (!ST || !ST.active) return;
    const b = ST.story.beats[ST.i++];
    if (!b) return finish();
    switch (b.type) {
      case 'novel': return showLines(b.lines, 'novel', next);
      case 'thought': return showLines([b.text], 'thought', next);
      case 'dark': return showDark(b.lines, next);
      case 'card': return showCard(b, next);
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
  const fmtLine = s => s.replace(/\*\*(.+?)\*\*/g, '<b class="sw-em">$1</b>').replace(/\n/g, '<br>');
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
        c.classList.add('hidden');
        showLines(op.reply, 'novel', cb);
      };
      box.appendChild(btn);
    });
    c.classList.remove('hidden');
  }

  /* ---------- 売買・入金 ---------- */
  function doBuy(b) {
    const r = E.order(1, b.size, null);
    const t = new Date(E.S.bars[E.S.idx][0]);
    console.log('[story] buy' + b.size + ' @bar ' + t.toISOString().slice(5, 16) + ' → ' + (r.err || 'ok @' + r.price.toFixed(1)));
    if (r.err) { CX.toast(r.err, 'bad'); return; }
    CX.notify('entry', '約定通知 — 新規買', '米国NQ100 買 ' + b.size + '枚 @' + CX.px(r.price) + (b.note ? '｜' + b.note : ''));
    CX.chart.refreshLines(E.S.positions);
    CX.trade.render();
  }
  function doOpt(b) {
    const S = E.S;
    if (!S.positions.length) return;
    const target = S.positions.reduce((a, p) => (a == null || p.id < a.id) ? p : a, null); // 最初の玉
    const avail = Math.floor(E.snapshot().avail);
    const amount = Math.min(b.amount, Math.max(0, avail));
    const t = new Date(S.bars[S.idx][0]);
    console.log('[story] opt' + b.amount + ' @bar ' + t.toISOString().slice(5, 16) + ' avail=' + avail + ' → amount=' + amount);
    if (amount <= 0) return;
    const r = E.addOptMargin(target.id, amount);
    if (r.err) { console.warn('story opt failed:', r.err); return; }
    CX.notify('opt', 'ロスカットレート変更', '任意証拠金 +' + CX.comma(amount) + '円 → LC ' + CX.px(r.losscut));
    CX.chart.refreshLines(S.positions);
    CX.trade.render();
  }
  function doDeposit(b) {
    E.deposit(b.amount);
    CX.notify('deposit', '入金完了', '+' + CX.comma(b.amount) + '円' + (b.note ? '｜' + b.note.replace(/^入金.*?—\s*/, '') : ''));
    CX.trade.render();
  }

  /* ---------- 再生・ジャンプ ---------- */
  function runReplay(b, cb) {
    const to = CX.parseIso(b.to);
    const S = E.S;
    if (S.bars[S.idx][0] >= to) return cb();
    S.speed = b.speed || 600;
    $('tr-speed').textContent = S.speed + 'x';
    $('tr-play').textContent = '⏸';
    ST.skipTo = b.noskip ? null : to;
    $('tr-skip').classList.toggle('hidden', !ST.skipTo);
    let done = false;
    const fire = () => {
      if (done || !ST || !ST.active) return;
      done = true;
      if (ST.watch) { clearInterval(ST.watch); ST.watch = null; }
      ST.skipTo = null;
      $('tr-skip').classList.add('hidden');
      $('tr-play').textContent = '▶';
      CX.trade.render();
      cb();
    };
    S.stopAt = to;          // エンジンがバー単位で正確に停止して呼び返す
    S.onStop = fire;
    E.play();
    ST.watch = setInterval(() => {  // データ末尾到達などの保険
      if (!ST || !ST.active) { clearInterval(ST.watch); return; }
      const S2 = E.S;
      if (!S2 || S2.ended) fire();
    }, 300);
  }

  function doJump(b) {
    const to = typeof b.t === 'number' ? b.t : CX.parseIso(b.to);
    const S = E.S;
    ST.jumping = true;
    E.pause();
    let guard = 0;
    while (S.bars[S.idx] && S.bars[S.idx][0] < to && guard++ < 300000 && !S.ended) {
      if (S.halt === 'gap') { S.halt = null; S.skipGap = true; E.step(); }
      else if (!E.step() && S.halt !== 'gap') break;
    }
    ST.jumping = false;
    $('ov-sleep').classList.add('hidden');
    CX.chart.setHistory(S.bars, S.idx);
    CX.chart.refreshLines(S.positions);
    CX.trade.render();
  }

  /* ---------- 終幕 ---------- */
  function finish() {
    if (!ST) return;
    hideAll();
    document.querySelector('.tf-row').style.display = '';
    const S = E.S;
    const L = ST.story.lessons;
    const snap = E.snapshot();
    const finalEq = Math.round(snap.equity);
    const invested = L.invested;
    const loss = invested - finalEq;
    const interventions = ST.picks.filter(i => i === 0).length;
    const doneKey = 'cx_story_' + ST.story.id;
    localStorage.setItem(doneKey, JSON.stringify({ at: Date.now(), finalEq }));

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

  return { start, abort, isActive, isJumping };
})();
