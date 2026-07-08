/* app.js — 起動と画面遷移 */
(function () {
  CX.onNav = function (name) {
    if (name === 'home') CX.home.render();
    if (name === 'data') CX.data.renderSymbols();
    if (name === 'profile') CX.profileUI.render();
  };

  document.querySelectorAll('[data-nav]').forEach(b =>
    b.addEventListener('click', () => CX.nav(b.dataset.nav)));

  CX.data.bind();
  CX.profileUI.bind();
  CX.trade.bind();
  CX.nav('home');

  /* ---- 同梱データの自動取込（初回のみ。data/ 配下をIndexedDBへ） ---- */
  const BUNDLED = [
    { code: 'USTEC', url: 'data/USTEC_2020_sub1.csv', name: 'USTEC_2020_sub1.csv' }
  ];
  (async () => {
    let metas;
    try { metas = await CX.db.getSymbols(); } catch (e) { return; }
    const missing = BUNDLED.filter(b => !metas.some(m => m.code === b.code));
    if (!missing.length) return;
    CX.toast('初回起動: 同梱データを準備しています…');
    for (const b of missing) {
      try {
        const res = await fetch(b.url);
        if (!res.ok) continue;
        const buf = await res.arrayBuffer();
        await CX.importer.importFiles([{ name: b.name, arrayBuffer: async () => buf }], () => {});
      } catch (e) { console.warn('bundled import failed:', b.name, e); }
    }
    CX.toast('データの準備が完了しました');
    CX.home.render();
  })();
})();
