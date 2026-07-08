/* chart.js — lightweight-charts ラッパー（時間足集計・匿名時刻表示・建玉/逆指値ライン） */
CX.chart = (function () {
  let chart = null, series = null, tf = 1, agg = [], lastBucket = null;
  let anonymBase = null, priceLines = [];
  let dayMarkers = [], lastDayKey = null;
  let tradeMarkers = [], fitAll = false;
  let dayBands = [], bandCanvas = null, bandRO = null; // 取引日ごとの背景ストライプ
  const WD = ['日', '月', '火', '水', '木', '金', '土'];

  function labelOf(sec) {
    const t = sec * 1000;
    const d = new Date(t);
    const hm = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
    if (anonymBase != null) return 'D' + (Math.floor((t - anonymBase) / 86400000) + 1) + ' ' + hm;
    return (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + ' ' + hm;
  }

  function init(anonBase, tf0, opts) {
    anonymBase = anonBase;
    tf = tf0 || 1;
    fitAll = !!(opts && opts.fitAll);
    dayMarkers = []; lastDayKey = null; tradeMarkers = []; dayBands = [];
    const el = CX.$('chart');
    el.innerHTML = '';
    if (bandRO) { bandRO.disconnect(); bandRO = null; }
    chart = LightweightCharts.createChart(el, {
      autoSize: true,
      layout: {
        background: { type: 'solid', color: '#0a0d12' },
        textColor: '#5a6375', fontSize: 10,
        fontFamily: "'IBM Plex Mono', monospace"
      },
      grid: { vertLines: { color: '#141a24' }, horzLines: { color: '#141a24' } },
      rightPriceScale: { borderColor: '#222a37' },
      timeScale: {
        borderColor: '#222a37', timeVisible: true, secondsVisible: false, rightOffset: 3,
        tickMarkFormatter: t => labelOf(t)
      },
      localization: { timeFormatter: t => labelOf(t) },
      crosshair: { mode: 0 },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false }
    });
    series = chart.addCandlestickSeries({
      upColor: '#f5453c', downColor: '#3d87ff',      // 日本式: 陽線=赤 / 陰線=青
      wickUpColor: '#f5453c', wickDownColor: '#3d87ff',
      borderVisible: false,
      priceFormat: { type: 'price', precision: 1, minMove: 0.1 }
    });
    agg = []; lastBucket = null; priceLines = [];

    // 取引日ごとの背景ストライプ用の透明キャンバス（チャートの上に薄く重ねる）
    bandCanvas = document.createElement('canvas');
    Object.assign(bandCanvas.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: 2 });
    el.appendChild(bandCanvas);
    chart.timeScale().subscribeVisibleTimeRangeChange(drawBands);
    bandRO = new ResizeObserver(drawBands);
    bandRO.observe(el);
  }

  /* 取引日ごとに1本おきに薄い帯を描く。境界のx座標はtimeScaleから取得 */
  function drawBands() {
    if (!bandCanvas || !chart) return;
    const el = CX.$('chart');
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    if (bandCanvas.width !== w * dpr || bandCanvas.height !== h * dpr) {
      bandCanvas.width = w * dpr; bandCanvas.height = h * dpr;
      bandCanvas.style.width = w + 'px'; bandCanvas.style.height = h + 'px';
    }
    const ctx = bandCanvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (dayBands.length < 2) return;
    const ts = chart.timeScale();
    for (let i = 0; i < dayBands.length; i++) {
      const x0 = ts.timeToCoordinate(dayBands[i] / 1000);
      if (x0 == null) continue;
      // 1日おきに薄い帯
      if (i % 2 === 1) {
        const x1 = i + 1 < dayBands.length ? ts.timeToCoordinate(dayBands[i + 1] / 1000) : w;
        const a = Math.max(0, x0), b = Math.min(w, x1 == null ? w : x1);
        if (b > a) { ctx.fillStyle = 'rgba(130,155,195,0.09)'; ctx.fillRect(a, 0, b - a, h); }
      }
      // 各取引日の境界に細い縦線
      if (x0 >= 0 && x0 <= w) {
        ctx.fillStyle = 'rgba(150,170,200,0.18)';
        ctx.fillRect(Math.round(x0), 0, 1, h);
      }
    }
  }

  function toCandle(b) { // BIDローソク
    return { time: b[0] / 1000, open: b[1], high: b[2], low: b[3], close: b[4] };
  }
  function bucketOf(t) { return Math.floor(t / (tf * 60000)) * tf * 60000; }

  /* 取引日の変わり目（朝の寄付バー）にマーカー */
  function trackDayMarker(b, bucketT) {
    const d = new Date(b[0]);
    const key = d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
    if (key === lastDayKey) return false;
    lastDayKey = key;
    if (d.getUTCHours() < 6) return false; // 深夜継続分（前取引日の続き）は打たない
    dayMarkers.push({
      time: bucketT / 1000, position: 'belowBar', color: '#5a6375', shape: 'arrowUp',
      text: (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '(' + WD[d.getUTCDay()] + ')'
    });
    dayBands.push(bucketT);
    return true;
  }

  function applyMarkers() {
    if (!series) return;
    series.setMarkers(dayMarkers.concat(tradeMarkers).sort((a, b) => a.time - b.time));
  }

  /* エントリー/決済の丸印（建玉と履歴から毎回組み直す） */
  function setTrades(S) {
    if (!series || !S) return;
    tradeMarkers = [];
    const reasonLabel = { manual: '決済', stop: '逆指', losscut: 'LC', force_close: '強制' };
    const entry = (t, size, px, faded) => tradeMarkers.push({
      time: bucketOf(t) / 1000, position: 'belowBar', shape: 'circle',
      color: faded ? '#2b5aa8' : '#3d87ff', size: 1, text: '買' + size + ' ' + Math.round(px).toLocaleString()
    });
    for (const h of S.history) {
      entry(h.tOpen, h.size, h.entry, true);
      tradeMarkers.push({
        time: bucketOf(h.tClose) / 1000, position: 'aboveBar', shape: 'circle',
        color: '#f5453c', size: 1, text: (reasonLabel[h.reason] || '決済') + ' ' + Math.round(h.exit).toLocaleString()
      });
    }
    for (const p of S.positions) entry(p.tOpen, p.size, p.entry, false);
    applyMarkers();
  }

  /* 全履歴を現在のTFで組み直す */
  function setHistory(bars, uptoIdx) {
    agg = [];
    lastBucket = null;
    dayMarkers = []; lastDayKey = null; dayBands = [];
    for (let i = 0; i <= uptoIdx; i++) push(bars[i], false);
    series.setData(agg.map(a => ({ time: a.t / 1000, open: a.o, high: a.h, low: a.l, close: a.c })));
    applyMarkers();
    if (fitAll) chart.timeScale().fitContent();
    else chart.timeScale().scrollToRealTime();
    drawBands();
  }

  /* 1分バーを1本進める */
  function push(b, render) {
    if (!series) return;
    const bk = bucketOf(b[0]);
    let newBucket = false;
    if (lastBucket === bk) {
      const a = agg[agg.length - 1];
      a.h = Math.max(a.h, b[2]); a.l = Math.min(a.l, b[3]); a.c = b[4];
    } else {
      agg.push({ t: bk, o: b[1], h: b[2], l: b[3], c: b[4] });
      lastBucket = bk;
      newBucket = true;
      if (agg.length > 3000) agg.shift();
    }
    const newMarker = trackDayMarker(b, bk);
    if (render !== false) {
      const a = agg[agg.length - 1];
      series.update({ time: a.t / 1000, open: a.o, high: a.h, low: a.l, close: a.c });
      if (newMarker) applyMarkers();
      if (fitAll && (newMarker || newBucket)) chart.timeScale().fitContent();
    }
  }

  function setTf(newTf, bars, uptoIdx) {
    tf = newTf;
    setHistory(bars, uptoIdx);
  }

  /* 建玉・逆指値ライン */
  function refreshLines(positions) {
    if (!series) return;
    for (const l of priceLines) series.removePriceLine(l);
    priceLines = [];
    for (const p of positions) {
      priceLines.push(series.createPriceLine({
        price: p.entry, color: p.side === 1 ? '#3d87ff' : '#f5453c', lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        title: (p.side === 1 ? '買' : '売') + p.size
      }));
      if (p.losscut != null) {
        priceLines.push(series.createPriceLine({
          price: p.losscut, color: '#f5453c', lineWidth: 1,
          lineStyle: LightweightCharts.LineStyle.SparseDotted, title: 'LC'
        }));
      }
      if (p.stop != null) {
        priceLines.push(series.createPriceLine({
          price: p.stop, color: '#ffb02e', lineWidth: 1,
          lineStyle: LightweightCharts.LineStyle.Dotted, title: '逆指値'
        }));
      }
    }
  }

  function destroy() {
    if (bandRO) { bandRO.disconnect(); bandRO = null; }
    bandCanvas = null;
    if (chart) { chart.remove(); chart = null; series = null; }
  }

  return { init, push, setTf, setHistory, refreshLines, setTrades, destroy, get tf() { return tf; } };
})();
