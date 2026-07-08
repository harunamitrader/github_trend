/* util.js — 共通ヘルパー */
const CX = {};

/* ---- 時刻: JSTの年月日時分を UTC として epoch(ms) に格納する（表示は getUTC* で読む） ---- */
CX.parseYmdHm = function (s) { // 'YYYYMMDDHHMM'
  return Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(8, 10), +s.slice(10, 12));
};
CX.parseIso = function (s) { // 'YYYY-MM-DDTHH:MM'
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
};
CX.fmtTime = function (t, anonymBase) {
  const d = new Date(t);
  const hm = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
  if (anonymBase != null) {
    const day = Math.floor((t - anonymBase) / 86400000) + 1;
    return 'Day ' + day + '  ' + hm;
  }
  return (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + ' ' + hm;
};
CX.fmtDate = function (t) {
  const d = new Date(t);
  return d.getUTCFullYear() + '/' + (d.getUTCMonth() + 1) + '/' + d.getUTCDate();
};

/* ---- 数値 ---- */
CX.comma = n => Math.round(n).toLocaleString('ja-JP');
CX.yen = function (n, sign) {
  const s = CX.comma(Math.abs(n));
  const pre = n < 0 ? '−' : (sign && n > 0 ? '+' : '');
  return pre + s + '円';
};
CX.px = n => n.toLocaleString('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
CX.pnlClass = n => n > 0 ? 'pnl-plus' : n < 0 ? 'pnl-minus' : '';

/* ---- プロファイル / 生涯成績 (localStorage) ---- */
CX.profile = {
  get() { try { return JSON.parse(localStorage.getItem('cx_profile')) || null; } catch (e) { return null; } },
  set(p) { localStorage.setItem('cx_profile', JSON.stringify(p)); },
  clear() { localStorage.removeItem('cx_profile'); }
};
CX.life = {
  get() {
    try { return JSON.parse(localStorage.getItem('cx_life')) || CX.life._blank(); }
    catch (e) { return CX.life._blank(); }
  },
  _blank: () => ({ attempts: 0, bankrupts: 0, losscuts: 0, worstPnl: 0, hist: [], locks: {} }),
  save(l) { localStorage.setItem('cx_life', JSON.stringify(l)); }
};

/* ---- 損失の生活翻訳 ---- */
CX.translateLoss = function (amount) { // amount: 負の値 = 損失
  const p = CX.profile.get();
  if (!p || !p.cost || amount >= 0) return '';
  const loss = -amount;
  const months = loss / (p.cost * 10000);
  let s = '生活費 ' + (months >= 10 ? Math.round(months) : months.toFixed(1)) + 'ヶ月分';
  if (p.save) {
    const pct = loss / (p.save * 10000) * 100;
    s += ' ／ 貯金の ' + (pct >= 100 ? Math.round(pct) : pct.toFixed(0)) + '%';
  }
  return s;
};

/* ---- DOM ---- */
CX.$ = id => document.getElementById(id);
CX.toast = function (msg, cls) {
  const t = CX.$('toast');
  t.textContent = msg;
  t.className = 'toast' + (cls ? ' ' + cls : '');
  clearTimeout(CX.toast._tm);
  CX.toast._tm = setTimeout(() => t.classList.add('hidden'), 2600);
};
/* イベントのプッシュ通知（約定・追証・入金など）。連続時はキューで順送り */
CX.notify = (function () {
  const q = [];
  let busy = false;
  function show() {
    if (busy || !q.length) return;
    busy = true;
    const { type, title, body, hold } = q.shift();
    const el = CX.$('push-note');
    el.className = 'push-note ' + type;
    el.querySelector('.pn-title').textContent = title;
    el.querySelector('.pn-body').textContent = body;
    setTimeout(() => {
      el.classList.add('leaving');
      setTimeout(() => { el.classList.add('hidden'); busy = false; show(); }, 320);
    }, hold || 2600);
  }
  return function (type, title, body, hold) {
    q.push({ type, title, body, hold });
    show();
  };
})();

CX.nav = function (name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  CX.$('scr-' + name).classList.remove('hidden');
  if (CX.onNav) CX.onNav(name);
};
