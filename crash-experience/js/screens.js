/* screens.js — ホーム / データ管理 / プロファイル / リザルト */

/* ============ HOME ============ */
CX.home = (function () {
  const $ = CX.$;

  async function render() {
    const metas = await CX.db.getSymbols();
    const stList = $('story-list');
    const story = CX.STORY_CORONA;
    const stMeta = metas.find(m => m.code === story.symbol);
    const stReady = stMeta && ['202002', '202003', '202004'].every(mm => stMeta.days.some(d => d.startsWith(mm)));
    const stDone = localStorage.getItem('cx_story_' + story.id);
    const save = CX.story.hasSave(story.id);
    let actions;
    if (!stReady) {
      actions = '<div class="sc-status ng">初回データ準備中です。数秒後に自動で有効になります…</div>';
    } else if (save) {
      actions = `<div class="st-actions">
        <button class="primary-btn" id="story-resume-btn">つづきから</button>
        <button class="ghost-btn" id="story-restart-btn">はじめから見直す</button>
      </div>`;
    } else {
      actions = '<div class="sc-status ok">▶ はじめる</div>';
    }
    stList.innerHTML = `
      <div class="story-home-card ${stReady ? '' : 'disabled'}" id="story-card-home">
        <div class="st-kicker">${story.subtitle}</div>
        <div class="st-title">${story.title}</div>
        <div class="st-meta">操作はできない。あなたはただ、彼の口座を見ている。<br>所要 ${story.minutes} ／ 価格はすべて実際の記録
        ${stDone ? '<br><span style="color:var(--red)">体験済み — もう一度、見届ける</span>' : ''}</div>
        ${actions}
      </div>`;
    if (stReady && save) {
      $('story-resume-btn').addEventListener('click', () => CX.story.start(story, save));
      $('story-restart-btn').addEventListener('click', () => CX.story.start(story));
    } else if (stReady) {
      $('story-card-home').addEventListener('click', () => CX.story.start(story));
    }
  }

  function card(sc, avail, life, meta) {
    const lockTs = life.locks[sc.id];
    const locked = lockTs && lockTs > Date.now();
    const results = life.hist.filter(h => h.scId === sc.id).slice(0, 3);
    const badges = results.map(h =>
      `<span class="badge ${h.reason === 'bankrupt' ? 'dead' : 'alive'}">${h.reason === 'bankrupt' ? '退場' : (h.pnl >= 0 ? '生還 +' : '生還 ')}${h.reason === 'bankrupt' ? '' : CX.comma(h.pnl)}</span>`).join('');
    let status, cls = '', attrs = '';
    if (locked) {
      status = '<div class="sc-status lock">🔒 退場により本日は入場禁止（明日また来てください）</div>';
      cls = 'disabled';
    } else if (avail.ok) {
      status = '<div class="sc-status ok">▶ 体験できます</div>';
      attrs = `data-play="${sc.id}" data-symbol="${avail.symbol}"`;
    } else {
      status = `<div class="sc-status ng">データ未取込 — ${sc.symbols[0]} の ${sc.period} 分のCSV/ZIPが必要です</div>`;
      cls = 'disabled';
    }
    const title = sc.anonymize && !sc.custom
      ? sc.title + '<span class="mask">' + sc.period + '</span>'
      : (meta ? meta.name + ' ' : '') + sc.title + '<span class="mask">' + sc.period + '</span>';
    return `<button class="sc-card ${cls}" ${attrs}>
      <div class="sc-title">${title}</div>
      <div class="sc-meta">${sc.desc}</div>
      ${badges ? '<div class="sc-badges">' + badges + '</div>' : ''}
      ${status}
    </button>`;
  }

  async function startScenario(scId, symbol) {
    const metas = await CX.db.getSymbols();
    const meta = metas.find(m => m.code === symbol);
    let sc = CX.scenarios.PRESETS.find(s => s.id === scId);
    if (!sc && meta) sc = CX.scenarios.customFor(meta);
    if (!sc || !meta) return CX.toast('シナリオを開始できません', 'bad');
    try { await CX.trade.open(sc, symbol, meta); }
    catch (e) { CX.toast(e.message, 'bad'); }
  }

  return { render };
})();

/* ============ DATA ============ */
CX.data = (function () {
  const $ = CX.$;

  function log(msg, cls) {
    const el = $('import-log');
    el.innerHTML += `<div class="${cls || ''}">${msg}</div>`;
    el.scrollTop = el.scrollHeight;
  }

  async function handleFiles(files) {
    if (!files.length) return;
    log('取込開始…');
    try {
      const r = await CX.importer.importFiles([...files], log);
      log(`完了: ${r.nFiles}ファイル / ${CX.comma(r.nBars)}本の1分足`, 'ok');
      await renderSymbols();
    } catch (e) {
      log('エラー: ' + e.message, 'err');
    }
  }

  async function renderSymbols() {
    const metas = await CX.db.getSymbols();
    const el = $('symbol-list');
    if (!metas.length) { el.innerHTML = '<div class="empty-note">まだデータがありません</div>'; return; }
    el.innerHTML = metas.map(m => `
      <div class="sym-card">
        <div>
          <div class="sym-name">${m.name} <span style="color:var(--faint);font-size:10px">${m.code}</span></div>
          <div class="sym-meta">${m.days.length}日分（${fmtDay(m.days[0])} 〜 ${fmtDay(m.days[m.days.length - 1])}）</div>
        </div>
        <button class="sym-del" data-del="${m.code}">削除</button>
      </div>`).join('');
    el.querySelectorAll('[data-del]').forEach(b =>
      b.addEventListener('click', async () => {
        if (!confirm(b.dataset.del + ' のデータを削除しますか？')) return;
        await CX.db.deleteSymbol(b.dataset.del);
        renderSymbols();
      }));
  }
  const fmtDay = d => d.slice(0, 4) + '/' + (+d.slice(4, 6)) + '/' + (+d.slice(6, 8));

  function bind() {
    const dz = $('dropzone'), fi = $('file-input');
    dz.addEventListener('click', () => fi.click());
    fi.addEventListener('change', () => { handleFiles(fi.files); fi.value = ''; });
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
    dz.addEventListener('drop', e => {
      e.preventDefault(); dz.classList.remove('drag');
      handleFiles(e.dataTransfer.files);
    });
  }

  return { bind, renderSymbols };
})();

/* ============ PROFILE ============ */
CX.profileUI = (function () {
  const $ = CX.$;
  function render() {
    const p = CX.profile.get() || {};
    $('pf-cost').value = p.cost || '';
    $('pf-save').value = p.save || '';
    $('pf-income').value = p.income || '';
  }
  function bind() {
    $('pf-save-btn').addEventListener('click', () => {
      const cost = +$('pf-cost').value, save = +$('pf-save').value, income = +$('pf-income').value;
      if (!cost || !save) return CX.toast('生活費と貯金額を入力してください', 'bad');
      CX.profile.set({ cost, save, income: income || 0 });
      CX.toast('保存しました。仮想口座残高 = ' + save + '万円');
      CX.nav('home');
    });
    $('pf-clear-btn').addEventListener('click', () => {
      CX.profile.clear(); render();
      CX.toast('消去しました（残高100万円で体験します）');
    });
  }
  return { render, bind };
})();

/* ============ RESULT ============ */
CX.result = (function () {
  const $ = CX.$;

  function show(r) {
    CX.nav('result');
    const dead = r.reason === 'bankrupt';
    const lc = r.tags.some(t => t.startsWith('強制ロスカット'));
    const word = dead ? '退場' : (r.pnl >= 0 ? '生還' : '生還');
    const pnlCls = CX.pnlClass(r.pnl);
    const life = CX.translateLoss(r.pnl);
    const p = CX.profile.get();
    let lifeBlock = '';
    if (r.pnl < 0 && life) {
      const months = p.income ? -r.pnl / (p.income * 10000) : null;
      lifeBlock = `<div class="res-life">この損失は <b>${life}</b>${months ? `<br>月収から取り戻すには <b>${months >= 10 ? Math.round(months) : months.toFixed(1)}ヶ月</b> かかります` : ''}</div>
        <div class="res-q">この損失で、人生は終わりますか。<br>それとも、再起できますか。</div>`;
    }
    const winRate = r.trades ? Math.round(r.wins / r.trades * 100) : 0;
    let cfBlock = '';
    if (r.cf && r.trades > 0) {
      const you = r.pnl, cf = r.cf.pnl;
      cfBlock = `<div class="cf-card">
        <div class="cf-title">もし、資金管理をしていたら — 同じエントリー・リスク2%・逆指値あり</div>
        <div class="cf-vs">
          <div class="cf-col"><div class="who">あなた</div>
            <div class="amt ${CX.pnlClass(you)}">${CX.yen(you, true)}</div>
            <div class="st">${dead ? '<span style="color:var(--red)">退場</span>' : '生還'}</div></div>
          <div class="cf-divider">対</div>
          <div class="cf-col"><div class="who">2%ルールのあなた</div>
            <div class="amt ${CX.pnlClass(cf)}">${CX.yen(cf, true)}</div>
            <div class="st">${r.cf.survived ? '生還' : '<span style="color:var(--red)">退場</span>'}</div></div>
        </div>
        <div class="cf-msg">暴落が悪いのではない。<br>サイズが、悪かった。</div>
      </div>`;
    }
    const reveal = r.anonym
      ? `<div class="res-reveal">この相場の正体 — <b>${r.symbolName}</b><br><b>${CX.fmtDate(r.fromT)} 〜 ${CX.fmtDate(r.toT)}</b>（${r.sc.title}・${r.sc.period}）<br>これは、実際に起きた値動きです。</div>`
      : '';
    const trades = r.history.length
      ? `<h2 class="sec-label" style="padding:0 16px">全トレード</h2><div class="res-trades">` +
        r.history.map(h => `<div class="hist-row">
          <span>${h.side === 1 ? '買' : '売'}${h.size} ${CX.px(h.entry)}→${CX.px(h.exit)} <span style="color:var(--faint)">${{ manual: '', stop: '逆指値', losscut: 'ロスカット' }[h.reason] || ''}</span></span>
          <span class="num ${CX.pnlClass(h.pnl)}">${CX.yen(h.pnl, true)}</span></div>`).join('') + '</div>'
      : '';

    $('result-body').innerHTML = `
      <div class="res-verdict ${dead ? 'dead' : ''}">
        <div class="kicker">${dead ? 'GAME OVER' : 'SCENARIO COMPLETE'}</div>
        <div class="word ${dead ? 'dead' : 'alive'}">${word}</div>
      </div>
      <div class="res-pnl"><div class="big ${pnlCls}">${CX.yen(r.pnl, true)}</div></div>
      ${lifeBlock}
      <div class="res-grid">
        <div class="res-stat"><div class="k">最終純資産</div><div class="v">${CX.yen(r.finalEquity)}</div></div>
        <div class="res-stat"><div class="k">最大ドローダウン</div><div class="v">−${CX.comma(r.maxDD)}円</div></div>
        <div class="res-stat"><div class="k">取引回数 / 勝率</div><div class="v">${r.trades}回 / ${winRate}%</div></div>
        <div class="res-stat"><div class="k">維持率最低</div><div class="v">${r.minRatio === Infinity ? '—' : Math.max(0, Math.round(r.minRatio)) + '%'}</div></div>
      </div>
      ${r.tags.length ? '<h2 class="sec-label" style="padding:0 16px">敗因分析</h2><div class="res-tags">' + r.tags.map(t => `<span class="res-tag">${t}</span>`).join('') + '</div>' : ''}
      ${cfBlock}
      ${reveal}
      ${trades}
      <button class="primary-btn res-back" id="res-back">ホームに戻る</button>`;
    $('res-back').addEventListener('click', () => { CX.engine.destroy(); CX.nav('home'); });
  }

  return { show };
})();
