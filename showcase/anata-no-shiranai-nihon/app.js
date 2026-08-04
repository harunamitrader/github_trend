/* あなたの知らない日本 — mobile-first prefecture defence game */

const app = document.querySelector('#app');
const DATA_URL = './data/japan-prefectures.v1.json?v=2';
const PROGRESS_KEY = 'anata-no-shiranai-nihon.progress.v2';
const E2E_MODE = new URLSearchParams(location.search).get('e2e') === '1';
const DEBUG_MODE = new URLSearchParams(location.search).get('debug') === '1';
const ROUND_SECONDS = E2E_MODE ? 0.15 : DEBUG_MODE ? 600 : 30;
const EFFECT_DELAY = E2E_MODE ? 40 : 3250;

const STORY_SLIDES = [
  {
    image: './assets/story/01-alert.png',
    chapter: 'ALERT 01 / INBOUND',
    title: '敵国から、ミサイルが発射された。',
    body: '防衛管制システムは、日本各地の着弾予測地点を検知した。あなたは、迎撃を指揮する管制官だ。',
  },
  {
    image: './assets/story/02-trajectory.png',
    chapter: 'ALERT 02 / ONE AT A TIME',
    title: '同時に防衛できるのは、一都道府県だけ。',
    body: '照準が指す場所を確認し、防衛対象を正しく指定しなければならない。認証窓は、わずか30秒。',
  },
  {
    image: './assets/story/03-intercept.png',
    chapter: 'ALERT 03 / CONTROL',
    title: 'あなたは、その場所の名前を知っているか。',
    body: '地図の照準と4つの都道府県名を照合せよ。正しい名前を選べば迎撃成功。間違えれば、その場所は防衛できない。',
  },
];

const REGIONS = {
  north: { name: '北日本', short: 'NORTH', console: '北日本モード', description: '北海道・東北', color: '#86c5d9' },
  east: { name: '東日本', short: 'EAST', console: '東日本モード', description: '関東', color: '#d8bd66' },
  central: { name: '中日本', short: 'CENTRAL', console: '中日本モード', description: '甲信越・北陸・東海', color: '#a7c984' },
  kinki: { name: '近畿', short: 'KINKI', console: '近畿モード', description: '三重・滋賀・京都・大阪・兵庫・奈良・和歌山', color: '#cf9ab7' },
  chugoku_shikoku: { name: '中国・四国', short: 'CHUGOKU / SHIKOKU', console: '中国・四国モード', description: '中国・四国', color: '#d69a7b' },
  kyushu_okinawa: { name: '九州・沖縄', short: 'KYUSHU / OKINAWA', console: '九州・沖縄モード', description: '九州・沖縄', color: '#df8f61' },
  national: { name: '全国モード', short: 'NATIONAL', console: '全国モード', description: '全国47都道府県', color: '#f1df97' },
};

let gameData;
let prefectures = [];
let byId = {};
let progress = loadProgress();
let run = null;
let mapState = null;
let timerHandle = null;
let storyIndex = 0;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || { keys: {} }; }
  catch { return { keys: {} }; }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function jpNumber(value) {
  return new Intl.NumberFormat('ja-JP').format(Math.round(value));
}

function formatPeople(value) {
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(2)}億人`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(value >= 1_000_000 ? 1 : 2)}万人`;
  return `${jpNumber(value)}人`;
}

function formatArea(value) {
  return `${jpNumber(value)} km²`;
}

function percentage(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function topoToFeatures(topology) {
  const transform = topology.transform || { scale: [1, 1], translate: [0, 0] };
  const decoded = topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * transform.scale[0] + transform.translate[0], y * transform.scale[1] + transform.translate[1]];
    });
  });
  const getArc = (index) => {
    const points = decoded[index < 0 ? ~index : index].map((point) => [...point]);
    return index < 0 ? points.reverse() : points;
  };
  const joinRing = (arcIndexes) => arcIndexes.reduce((ring, index, position) => {
    const points = getArc(index);
    return ring.concat(position ? points.slice(1) : points);
  }, []);
  const convert = (geometry) => {
    if (geometry.type === 'Polygon') return { type: 'Polygon', coordinates: geometry.arcs.map(joinRing) };
    if (geometry.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: geometry.arcs.map((polygon) => polygon.map(joinRing)) };
    throw new Error(`Unsupported TopoJSON geometry: ${geometry.type}`);
  };
  return topology.objects.japan.geometries.map((geometry) => ({
    type: 'Feature', properties: geometry.properties || {}, geometry: convert(geometry),
  }));
}

function omitTokyoRemoteIslands(feature) {
  if (!feature || feature.geometry.type !== 'MultiPolygon') return feature;
  // 伊豆・小笠原など、東日本マップの表示範囲を大きく広げる遠方島しょ部は省く。
  // 東京本土と東京湾内・近接島しょは北緯35度以北なので残す。
  const mainlandAndNearby = feature.geometry.coordinates.filter((polygon) => (
    polygon[0]?.some(([, latitude]) => latitude >= 35)
  ));
  return {
    ...feature,
    geometry: { ...feature.geometry, coordinates: mainlandAndNearby },
  };
}

function initialiseData(data) {
  const featureById = Object.fromEntries(topoToFeatures(data.topology).map((feature) => [String(Number(feature.properties.id)).padStart(2, '0'), feature]));
  prefectures = data.prefectures.map((prefecture, index) => ({
    ...prefecture,
    feature: prefecture.id === '13' ? omitTokyoRemoteIslands(featureById[prefecture.id]) : featureById[prefecture.id],
    mapColor: ['#478ba2', '#3c7891', '#a8b87b', '#c89a66', '#ae84ae', '#6ba3c5'][index % 6],
  })).sort((a, b) => Number(a.id) - Number(b.id));
  byId = Object.fromEntries(prefectures.map((prefecture) => [prefecture.id, prefecture]));
}

function sectors() {
  return Object.keys(REGIONS).filter((id) => id !== 'national');
}

function prefecturesFor(regionId) {
  return regionId === 'national' ? prefectures : prefectures.filter((prefecture) => prefecture.region === regionId);
}

function isNationalUnlocked() {
  return sectors().every((regionId) => progress.keys?.[regionId]);
}

function countProgress() {
  return sectors().filter((regionId) => progress.keys?.[regionId]).length;
}

function clearTimer() {
  if (timerHandle) window.clearInterval(timerHandle);
  timerHandle = null;
}

function renderIntro() {
  clearTimer();
  app.innerHTML = `
    <main class="intro-screen screen">
      <div class="intro-grid"></div>
      <div class="signal-dots" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="intro-copy">
        <p class="console-label">JAPAN AIR DEFENCE / PREFECTURE PROTOCOL</p>
        <p class="alert-chip"><span></span> INBOUND ALERT</p>
        <h1>あなたの<br><em>知らない日本</em></h1>
        <p class="intro-lead">照準が示す都道府県を、<br>あなたは守れるか。</p>
        <p class="intro-brief">着弾予測地点を地図で確認し、4つの候補から都道府県名を選択。ひとつずつ、迎撃管制を実行せよ。</p>
        <button class="primary-button intro-button" data-action="story">管制を開始する <span>→</span></button>
      </section>
      <dl class="intro-stats"><div><dt>DEFENCE UNITS</dt><dd>47</dd></div><div><dt>RESPONSE WINDOW</dt><dd>30<span>SEC</span></dd></div></dl>
    </main>`;
}

function renderStory() {
  clearTimer();
  const slide = STORY_SLIDES[storyIndex];
  const isLast = storyIndex === STORY_SLIDES.length - 1;
  app.innerHTML = `
    <main class="story-screen screen" style="--story-image: url('${slide.image}')">
      <div class="story-image"></div><div class="story-scrim"></div>
      <header class="story-header"><span>${slide.chapter}</span><span>${String(storyIndex + 1).padStart(2, '0')} / 03</span></header>
      <section class="story-copy">
        <p class="console-label">JAPAN AIR DEFENCE COMMAND</p>
        <h2>${slide.title}</h2><p>${slide.body}</p>
      </section>
      <footer class="story-footer"><button class="text-button" data-action="skip-story">スキップ</button><button class="primary-button" data-action="next-story">${isLast ? '地域を選ぶ' : '次へ'} <span>→</span></button></footer>
    </main>`;
}

function renderModes() {
  clearTimer();
  const cards = sectors().map((regionId) => {
    const region = REGIONS[regionId];
    const units = prefecturesFor(regionId).length;
    const done = Boolean(progress.keys?.[regionId]);
    return `<button class="sector-card ${done ? 'is-cleared' : ''}" data-action="briefing" data-region="${regionId}">
      <span class="sector-index">${region.short}</span><span class="sector-status">${done ? 'クリア済み' : '未クリア'}</span>
      <strong>${region.name}</strong><small>${region.description} / ${units}都道府県</small><i aria-hidden="true">→</i>
    </button>`;
  }).join('');
  const nationalAvailable = isNationalUnlocked();
  app.innerHTML = `
    <main class="mode-screen screen">
      <header class="page-header"><div><p class="console-label">REGIONAL MODES / ${countProgress()} OF ${sectors().length} CLEARED</p><h2>地域を選ぶ</h2><p>地域別モードを全問正解でクリアして、全国モードを解放しよう。</p></div><button class="text-button" data-action="intro">終了</button></header>
      <section class="sector-list">${cards}</section>
      <section class="national-card ${nationalAvailable ? 'is-ready' : 'is-locked'}">
        <div><p class="console-label">FINAL MODE</p><strong>全国モード</strong><small>全国47都道府県</small></div>
        <button class="primary-button" data-action="briefing" data-region="national" ${nationalAvailable ? '' : 'disabled'}>${nationalAvailable ? '全国モードを開始' : `あと ${sectors().length - countProgress()} 地域`}</button>
      </section>
      <p class="mode-note">地域別モードは全問正解でクリアです。ひとつでも防衛に失敗すると、再挑戦になります。</p>
    </main>`;
}

function renderBriefing(regionId) {
  clearTimer();
  const region = REGIONS[regionId];
  const units = prefecturesFor(regionId);
  const national = regionId === 'national';
  app.innerHTML = `
    <main class="briefing-screen screen">
      <header class="page-header"><div><p class="console-label">${national ? 'FINAL / NATIONAL MODE' : `REGIONAL MODE / ${region.short}`}</p><h2>${region.name}</h2></div><button class="text-button" data-action="modes">地域一覧へ</button></header>
      <section class="briefing-panel">
        <div class="briefing-rule"><span class="rule-number">01</span><p>地図上の<em>着弾予測地点</em>を確認する。地図の都道府県名は表示されない。</p></div>
        <div class="briefing-rule"><span class="rule-number">02</span><p>表示された4つの候補から、その場所の<em>都道府県名</em>を選んで確定する。</p></div>
        <div class="briefing-rule"><span class="rule-number">03</span><p>正解なら迎撃。不正解または時間切れなら、<em>照準の都道府県だけ</em>が防衛失敗となる。</p></div>
      </section>
      <dl class="briefing-stats"><div><dt>防衛対象</dt><dd>${units.length}<small>都道府県</small></dd></div><div><dt>認証時間</dt><dd>30<small>SEC</small></dd></div><div><dt>候補数</dt><dd>4<small>CHOICES</small></dd></div></dl>
      <aside class="briefing-callout">${national ? '全国モードです。結果は今回の防衛記録として保存されます。' : '地域クリア条件：対象の全都道府県を、一度も失わずに防衛する。'}</aside>
      <button class="primary-button wide-button" data-action="begin" data-region="${regionId}">${national ? '全国モードを開始する' : '地域別モードを開始する'} <span>→</span></button>
    </main>`;
}

function createRun(regionId) {
  const ids = prefecturesFor(regionId).map((prefecture) => prefecture.id);
  return {
    regionId,
    queue: shuffle(ids),
    statuses: Object.fromEntries(ids.map((id) => [id, 'pending'])),
    stats: { correct: 0, wrong: 0, timeout: 0, streak: 0, maxStreak: 0 },
    currentId: null,
    choices: [],
    selectedId: null,
    resolving: false,
    deadline: 0,
  };
}

function totals() {
  const targets = prefecturesFor(run.regionId);
  const saved = targets.filter((prefecture) => run.statuses[prefecture.id] === 'saved');
  const failed = targets.filter((prefecture) => run.statuses[prefecture.id] === 'failed');
  const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);
  return {
    target: { count: targets.length, population: sum(targets, 'population'), area: sum(targets, 'areaKm2') },
    saved: { count: saved.length, population: sum(saved, 'population'), area: sum(saved, 'areaKm2') },
    failed: { count: failed.length, population: sum(failed, 'population'), area: sum(failed, 'areaKm2'), items: failed },
  };
}

function nextRound() {
  clearTimer();
  if (!run.queue.length) { renderResults(); return; }
  run.currentId = run.queue.shift();
  run.selectedId = null;
  run.resolving = false;
  const target = byId[run.currentId];
  const pool = prefecturesFor(run.regionId).filter((prefecture) => prefecture.id !== target.id);
  run.choices = shuffle([target, ...shuffle(pool).slice(0, 3)]).map((prefecture) => prefecture.id);
  renderGame();
  startTimer();
}

function renderGame() {
  const region = REGIONS[run.regionId];
  const total = totals();
  const candidates = run.choices.map((id, index) => `<button class="choice-button" data-candidate="${id}"><span>${String(index + 1).padStart(2, '0')}</span>${byId[id].name}</button>`).join('');
  app.innerHTML = `
    <main class="game-screen screen">
      <header class="mission-header"><div><p class="console-label">${region.console} / ${run.regionId === 'national' ? 'NATIONAL' : region.short} / ROUND <span id="round">${String(run.stats.correct + run.stats.wrong + run.stats.timeout + 1).padStart(2, '0')}</span></p><p class="mission-title">着弾予測地点を確認せよ</p></div><div id="timer" class="timer" aria-label="残り時間">00:30</div></header>
      <section class="battlefield"><div class="map-frame"><svg id="japan-map" role="img" aria-label="着弾予測地点が表示された日本地図"></svg><div class="map-tip">二本指で拡大・縮小 / 一本指で移動</div></div></section>
      <section class="answer-panel"><div class="answer-heading"><p class="console-label">PREFECTURE IDENTIFICATION</p><strong>照準が示す都道府県名は？</strong></div><div class="choice-grid" id="choice-grid">${candidates}</div><button id="confirm" class="primary-button confirm-button" data-action="confirm" disabled>この都道府県を防衛する <span>→</span></button></section>
      <footer class="run-status"><span id="protected-count">防衛成功 ${total.saved.count}</span><span id="failed-count">防衛失敗 ${total.failed.count}</span><span id="population-rate">人口防衛率 ${percentage(total.saved.population, total.target.population)}%</span></footer>
    </main>`;
  drawMap({ targetId: run.currentId, focusRegion: run.regionId });
}

function drawMap({ targetId = null, focusRegion = 'national', final = false } = {}) {
  const svg = d3.select('#japan-map');
  if (svg.empty()) return;
  const container = svg.node().parentElement;
  const width = Math.max(300, container.clientWidth || 360);
  const height = Math.max(330, container.clientHeight || 420);
  svg.attr('viewBox', `0 0 ${width} ${height}`);
  const focus = focusRegion === 'national' ? prefectures : prefecturesFor(focusRegion);
  const featureCollection = { type: 'FeatureCollection', features: focus.map((prefecture) => prefecture.feature) };
  const projection = d3.geoMercator().fitExtent([[20, 20], [width - 20, height - 20]], featureCollection);
  const path = d3.geoPath(projection);
  const layer = svg.append('g').attr('class', 'map-layer');
  const allPaths = layer.selectAll('path').data(prefectures).join('path')
    .attr('data-prefecture', (prefecture) => prefecture.id)
    .attr('d', (prefecture) => path(prefecture.feature))
    .attr('class', (prefecture) => {
      const status = run?.statuses[prefecture.id] || 'pending';
      const outside = focusRegion !== 'national' && prefecture.region !== focusRegion;
      return `prefecture-path status-${status}${outside ? ' is-outside' : ''}${prefecture.id === targetId ? ' is-target' : ''}`;
    })
    .style('fill', (prefecture) => (run?.statuses[prefecture.id] === 'pending' ? prefecture.mapColor : null));
  if (targetId) {
    const target = byId[targetId];
    const point = projection(target.anchor);
    const reticle = layer.append('g').attr('class', 'target-reticle').attr('data-target-reticle', targetId).attr('transform', `translate(${point[0]}, ${point[1]})`);
    reticle.append('circle').attr('r', 22); reticle.append('circle').attr('r', 12); reticle.append('circle').attr('r', 3);
    reticle.append('path').attr('d', 'M-30,0H30 M0,-30V30');
  }
  if (final) {
    layer.selectAll('.status-saved').each(function (prefecture) {
      const point = projection(prefecture.anchor);
      layer.append('g').attr('class', 'shield-marker').attr('transform', `translate(${point[0]}, ${point[1]})`).append('path').attr('d', 'M0,-7 L6,-4 V3 L0,8 L-6,3 V-4 Z');
    });
  }
  mapState = { svg, layer, projection, width, height, paths: allPaths };
  installMapGestures(svg.node(), layer, width, height);
}

function installMapGestures(svgNode, layer, width, height) {
  let active = false;
  let start = null;
  let translate = [0, 0];
  let scale = 1;
  let initialPinch = null;
  const apply = () => layer.attr('transform', `translate(${translate[0]},${translate[1]}) scale(${scale})`);
  svgNode.addEventListener('pointerdown', (event) => { if (event.pointerType !== 'mouse' || event.button === 0) { active = true; start = [event.clientX, event.clientY, ...translate]; svgNode.setPointerCapture?.(event.pointerId); } });
  svgNode.addEventListener('pointermove', (event) => { if (!active || !start) return; translate = [start[2] + event.clientX - start[0], start[3] + event.clientY - start[1]]; apply(); });
  svgNode.addEventListener('pointerup', () => { active = false; start = null; });
  svgNode.addEventListener('wheel', (event) => { event.preventDefault(); const factor = event.deltaY < 0 ? 1.12 : 0.89; scale = Math.max(0.8, Math.min(3, scale * factor)); apply(); }, { passive: false });
  svgNode.addEventListener('touchstart', (event) => { if (event.touches.length === 2) { const [a, b] = event.touches; initialPinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); } }, { passive: true });
  svgNode.addEventListener('touchmove', (event) => { if (event.touches.length !== 2 || !initialPinch) return; const [a, b] = event.touches; const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); scale = Math.max(0.8, Math.min(3, scale * (distance / initialPinch))); initialPinch = distance; apply(); }, { passive: true });
  svgNode.addEventListener('touchend', () => { initialPinch = null; }, { passive: true });
}

function startTimer() {
  run.deadline = Date.now() + ROUND_SECONDS * 1000;
  const update = () => {
    if (!run || run.resolving) return;
    const remaining = Math.max(0, run.deadline - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    const timer = document.querySelector('#timer');
    if (timer) { timer.textContent = formatTimer(seconds); timer.classList.toggle('is-urgent', seconds <= 5); }
    if (remaining <= 0) { clearTimer(); resolveAnswer('timeout'); }
  };
  update();
  timerHandle = window.setInterval(update, 100);
}

function updateRunStatus() {
  if (!run) return;
  const total = totals();
  const saved = document.querySelector('#protected-count');
  const failed = document.querySelector('#failed-count');
  const population = document.querySelector('#population-rate');
  if (saved) saved.textContent = `防衛成功 ${total.saved.count}`;
  if (failed) failed.textContent = `防衛失敗 ${total.failed.count}`;
  if (population) population.textContent = `人口防衛率 ${percentage(total.saved.population, total.target.population)}%`;
}

function chooseCandidate(id) {
  if (!run || run.resolving) return;
  run.selectedId = id;
  document.querySelectorAll('[data-candidate]').forEach((button) => button.classList.toggle('is-selected', button.dataset.candidate === id));
  const confirm = document.querySelector('#confirm');
  if (confirm) confirm.disabled = false;
}

function resolveAnswer(kind) {
  if (!run || run.resolving) return;
  run.resolving = true;
  clearTimer();
  const target = byId[run.currentId];
  const correct = kind !== 'timeout' && run.selectedId === target.id;
  if (correct) {
    run.statuses[target.id] = 'saved'; run.stats.correct += 1; run.stats.streak += 1; run.stats.maxStreak = Math.max(run.stats.maxStreak, run.stats.streak);
  } else {
    run.statuses[target.id] = 'failed'; run.stats.streak = 0; if (kind === 'timeout') run.stats.timeout += 1; else run.stats.wrong += 1;
  }
  updateRunStatus();
  document.querySelectorAll('[data-candidate]').forEach((button) => button.disabled = true);
  const confirm = document.querySelector('#confirm'); if (confirm) confirm.disabled = true;
  playImpact(target, correct, kind);
  window.setTimeout(nextRound, EFFECT_DELAY);
}

function playImpact(target, correct, kind) {
  if (!mapState) return;
  const { svg, layer, projection, width, height } = mapState;
  const targetPoint = projection(target.anchor);
  const targetPath = svg.select(`[data-prefecture="${target.id}"]`);
  const reticle = svg.select('[data-target-reticle]');
  const overlay = layer.append('g').attr('class', `outcome-overlay ${correct ? 'success' : 'failure'}`);
  const showOutcome = () => {
    const title = correct ? '迎撃成功' : kind === 'timeout' ? '時間切れ' : '防衛失敗';
    const message = correct ? `${target.name}を完全防衛しました。` : `${target.name}は海へ沈みました。`;
    const panel = document.createElement('section');
    panel.className = `outcome-card ${correct ? 'success' : 'failure'}`;
    panel.innerHTML = `<p>${title}</p><strong>${message}</strong><small>${correct ? '敵ミサイルを空中迎撃。次の照準へ切り替えます。' : '照準の都道府県だけが、防衛不能となりました。'}</small>`;
    document.querySelector('.battlefield')?.append(panel);
  };
  const enemyStart = [Math.max(14, targetPoint[0] - Math.min(210, width * .46)), Math.max(16, targetPoint[1] - Math.min(185, height * .42))];
  const delay = (milliseconds) => E2E_MODE ? 1 : milliseconds;
  if (!correct) {
    animateMissile(overlay, { start: enemyStart, end: targetPoint, type: 'enemy', duration: delay(760), arc: 42, onComplete: () => {
      targetPath.classed('is-hit', true);
      reticle.classed('is-impact', true);
      document.querySelector('.battlefield')?.classList.add('is-impacting');
      showExplosion(overlay, targetPoint, 'impact');
      window.setTimeout(() => targetPath.classed('is-sinking', true), delay(170));
      window.setTimeout(showOutcome, delay(1500));
    }});
    return;
  }
  const interceptPoint = [targetPoint[0], Math.max(34, targetPoint[1] - 48)];
  const interceptorStart = [Math.min(width - 14, targetPoint[0] + Math.min(170, width * .34)), Math.min(height - 14, targetPoint[1] + Math.min(150, height * .34))];
  animateMissile(overlay, { start: enemyStart, end: interceptPoint, type: 'enemy', duration: delay(760), arc: 42 });
  window.setTimeout(() => animateMissile(overlay, { start: interceptorStart, end: interceptPoint, type: 'interceptor', duration: delay(500), arc: -24, onComplete: () => {
    targetPath.classed('is-defended', true);
    reticle.classed('is-secured', true);
    showExplosion(overlay, interceptPoint, 'intercept');
    const beam = overlay.append('path').attr('class', 'defence-beam').attr('d', `M ${targetPoint[0]} ${targetPoint[1]} L ${interceptPoint[0]} ${interceptPoint[1]}`);
    window.setTimeout(() => beam.remove(), delay(980));
    window.setTimeout(showOutcome, delay(1380));
  }}), delay(260));
}

function animateMissile(layer, { start, end, type, duration, arc, onComplete = () => {} }) {
  const missile = layer.append('g').attr('class', `missile ${type}-missile`);
  missile.append('path').attr('d', 'M0,-12 L5,8 L0,4 L-5,8 Z');
  missile.append('circle').attr('class', 'missile-flame').attr('r', 4).attr('cy', 8);
  const trail = layer.append('path').attr('class', `missile-trail ${type}-trail`).attr('d', `M ${start[0]} ${start[1]} Q ${(start[0] + end[0]) / 2} ${(start[1] + end[1]) / 2 - arc} ${end[0]} ${end[1]}`);
  const started = performance.now();
  const fly = (now) => {
    const t = Math.min(1, (now - started) / duration);
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t - Math.sin(t * Math.PI) * arc;
    const nextT = Math.min(1, t + .015);
    const nextX = start[0] + (end[0] - start[0]) * nextT;
    const nextY = start[1] + (end[1] - start[1]) * nextT - Math.sin(nextT * Math.PI) * arc;
    const angle = Math.atan2(nextY - y, nextX - x) * 180 / Math.PI + 90;
    missile.attr('transform', `translate(${x}, ${y}) rotate(${angle})`);
    if (t < 1) requestAnimationFrame(fly);
    else { missile.remove(); trail.classed('is-complete', true); onComplete(); }
  };
  requestAnimationFrame(fly);
}

function showExplosion(layer, point, type) {
  const burst = layer.append('g').attr('class', `impact-burst ${type}`).attr('transform', `translate(${point[0]}, ${point[1]})`);
  [9, 21, 38, 58].forEach((radius) => burst.append('circle').attr('r', radius));
  burst.append('path').attr('class', 'blast-star').attr('d', 'M0,-34 L6,-7 L31,0 L6,7 L0,34 L-6,7 L-31,0 L-6,-7 Z');
}

function evaluation(total) {
  const accuracy = percentage(run.stats.correct, total.target.count);
  const defended = percentage(total.saved.count, total.target.count);
  const population = percentage(total.saved.population, total.target.population);
  const area = percentage(total.saved.area, total.target.area);
  const regional = run.regionId !== 'national';
  const cleared = regional && total.failed.count === 0;
  const grade = regional ? (cleared ? 'S' : 'D') : accuracy >= 90 && defended >= 90 ? 'S' : accuracy >= 75 && defended >= 75 ? 'A' : accuracy >= 50 && defended >= 60 ? 'C' : 'D';
  return { accuracy, defended, population, area, cleared, grade };
}

function renderResults() {
  clearTimer();
  const total = totals();
  const result = evaluation(total);
  const national = run.regionId === 'national';
  if (!national && result.cleared) { progress.keys ||= {}; progress.keys[run.regionId] = true; saveProgress(); }
  const label = national ? '全国モード・防衛記録' : `${REGIONS[run.regionId].name}モード・結果`;
  const failedList = total.failed.items.length ? total.failed.items.map((prefecture) => `<li><span>${prefecture.name}</span><small>${formatPeople(prefecture.population)} / ${formatArea(prefecture.areaKm2)}</small></li>`).join('') : '<li><span>防衛失敗はありません。</span></li>';
  app.innerHTML = `
    <main class="result-screen screen">
      <section class="result-hero"><p class="console-label">${national ? 'FINAL DEFENCE LOG' : 'REGIONAL MODE RESULT'}</p><h2>${label}</h2><div class="grade grade-${result.grade}">${result.grade}<small>GRADE</small></div><p>${national ? 'あなたが守れた日本の記録です。' : result.cleared ? 'この地域をクリアしました。' : '地域クリアの基準に届きませんでした。'}</p></section>
      <section class="result-map-wrap"><svg id="japan-map" role="img" aria-label="防衛結果を示す日本地図"></svg><span>緑：防衛成功　海：防衛失敗</span></section>
      <dl class="result-grid"><div><dt>防衛失敗 / 対象</dt><dd>${total.failed.count}<small>/ ${total.target.count} 都道府県</small></dd></div><div><dt>正解率</dt><dd>${result.accuracy}<small>%</small></dd></div><div><dt>防衛できなかった人口</dt><dd>${formatPeople(total.failed.population)}<small>/ ${formatPeople(total.target.population)}（${percentage(total.failed.population, total.target.population)}%）</small></dd></div><div><dt>防衛できなかった面積</dt><dd>${formatArea(total.failed.area)}<small>/ ${formatArea(total.target.area)}（${percentage(total.failed.area, total.target.area)}%）</small></dd></div><div><dt>人口防衛率</dt><dd>${result.population}<small>%</small></dd></div><div><dt>最大連続成功</dt><dd>${run.stats.maxStreak}<small>連続</small></dd></div></dl>
      <section class="result-callout">${national ? '残った地図が、あなたの守った日本です。' : result.cleared ? `完全防衛。地域クリアです。全国モード解放まで、残り ${sectors().length - countProgress()} 地域。` : '地域クリアには、対象の全都道府県を防衛する必要があります。'}</section>
      <section class="failed-panel"><p class="console-label">${national ? 'DEFENCE FAILURE LOG' : 'SIMULATED FAILURE LOG'}</p><ul>${failedList}</ul></section>
      <footer class="result-actions"><button class="primary-button" data-action="retry">同じ地域を再挑戦 <span>↻</span></button><button class="outline-button" data-action="modes">地域一覧</button></footer>
    </main>`;
  drawMap({ focusRegion: run.regionId, final: true });
}

app.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.dataset.candidate) { chooseCandidate(button.dataset.candidate); return; }
  const action = button.dataset.action;
  if (action === 'intro') renderIntro();
  if (action === 'story') { storyIndex = 0; renderStory(); }
  if (action === 'next-story') { storyIndex += 1; storyIndex < STORY_SLIDES.length ? renderStory() : renderModes(); }
  if (action === 'skip-story') renderModes();
  if (action === 'modes') renderModes();
  if (action === 'briefing') renderBriefing(button.dataset.region);
  if (action === 'begin') { run = createRun(button.dataset.region); nextRound(); }
  if (action === 'confirm') resolveAnswer('answer');
  if (action === 'retry') { const retryRegion = run.regionId; run = createRun(retryRegion); nextRound(); }
});

async function boot() {
  try {
    gameData = await fetch(DATA_URL).then((response) => { if (!response.ok) throw new Error(`data ${response.status}`); return response.json(); });
    initialiseData(gameData);
    renderIntro();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
  } catch (error) {
    app.innerHTML = `<main class="fatal-screen"><p>防衛地図データを読み込めませんでした。</p><small>${error.message}</small></main>`;
  }
}

boot();
