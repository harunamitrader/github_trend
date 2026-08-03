/* あなたの知る世界 — static, mobile-first game client */

const app = document.querySelector('#app');
const DATA_URL = './data/world-data.v1.json';
const PROGRESS_KEY = 'anata-no-shiru-sekai.progress.v1';
const E2E_MODE = new URLSearchParams(window.location.search).get('e2e') === '1';
const ROUND_SECONDS = E2E_MODE ? 0.1 : 30;
const EFFECT_DELAY = E2E_MODE ? 10 : 0;
const STORY_AUTO_ADVANCE_MS = E2E_MODE ? 10 : 5600;

const STORY_SLIDES = [
  {
    image: './assets/story/01-activation.png',
    chapter: 'INCIDENT 01 / ACTIVATION',
    title: 'あなたは、押してはいけないボタンを押した。',
    body: '世界中の国家に向けて、終末兵器の攻撃命令が送信された。通常の方法では、もう止められない。',
  },
  {
    image: './assets/story/02-crisis.png',
    chapter: 'INCIDENT 02 / COLLAPSE',
    title: '残された停止手段は、地理認証だけ。',
    body: '国名と場所を正しく結びつけられた国だけが、攻撃命令から外される。知らない国は、救えない。',
  },
  {
    image: './assets/story/03-authentication.png',
    chapter: 'INCIDENT 03 / AUTHENTICATION',
    title: 'あなたの知識が、世界を守る。',
    body: '地図上で照準された国を、4つの国名から認証せよ。すべてが終わったとき、残るのは――あなたの知る世界。',
  },
];

const REGIONS = {
  asia: { name: 'アジア', console: '東部管制区', short: 'ASIA', center: [95, 30] },
  europe: { name: 'ヨーロッパ', console: '西部管制区', short: 'EUROPE', center: [15, 53] },
  africa: { name: 'アフリカ', console: '赤道管制区', short: 'AFRICA', center: [20, 5] },
  north_central_america_caribbean: { name: '北・中央アメリカ／カリブ海', console: '大西洋管制区', short: 'ATLANTIC', center: [-90, 20] },
  south_america: { name: '南アメリカ', console: '南部管制区', short: 'SOUTH', center: [-60, -20] },
  oceania: { name: 'オセアニア', console: '太平洋管制区', short: 'PACIFIC', center: [165, -15] },
  world: { name: '全世界', console: '中央管制システム', short: 'WORLD', center: [135, 20] },
};

const QUIZ_TYPES = {
  location: {
    name: '国名から位置を選ぶ',
    short: '地図認証',
    briefing: '表示される国名と位置を照合し、地図上の領域を保護先として指定せよ。',
  },
  choice: {
    name: '地図から国名を選ぶ',
    short: '4択認証',
    briefing: '地図上で照準された国を確認し、同じ地域の4つの国名から正解を選べ。',
  },
};

let gameData;
let byId;
let progress = loadProgress();
let run = null;
let timerHandle = null;
let mapController = null;
let toastTimer = null;
let audioContext = null;
let storyTimer = null;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function formatNumber(value) {
  return new Intl.NumberFormat('ja-JP').format(Math.round(value));
}

function formatArea(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}百万 km²`;
  return `${formatNumber(value)} km²`;
}

function formatPopulation(value) {
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(2)}億人`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(1)}万人`;
  return `${formatNumber(value)}人`;
}

function flagMarkup(country, className = 'inline-flag') {
  return `<img class="${className}" src="${country.flagAsset}" alt="${country.name}の国旗">`;
}

function getModeCountries(modeId) {
  return modeId === 'world'
    ? gameData.countries
    : gameData.countries.filter((country) => country.region === modeId);
}

function isWorldUnlocked() {
  return Object.keys(REGIONS)
    .filter((id) => id !== 'world')
    .every((id) => (progress[id]?.keys || 0) >= 1);
}

function getRegionProgress(id) {
  return progress[id] || { keys: 0 };
}

function makeRun(modeId, quizType = 'location') {
  const countries = getModeCountries(modeId);
  const statuses = Object.fromEntries(countries.map((country) => [country.id, { status: 'unresolved' }]));
  return {
    modeId,
    quizType,
    countries,
    ids: new Set(countries.map((country) => country.id)),
    statuses,
    phase: 'briefing',
    targetId: null,
    selectedId: null,
    choiceIds: [],
    answerResult: null,
    round: 0,
    deadline: 0,
    stats: { correct: 0, wrong: 0, timeout: 0, streak: 0, maxStreak: 0 },
    answerLog: [],
    recentSunk: new Set(),
  };
}

function countryStatus(id) {
  return run?.statuses[id]?.status || 'inactive';
}

function activeUnresolved() {
  return run.countries.filter((country) => countryStatus(country.id) === 'unresolved');
}

function sumFor(status) {
  const countries = run.countries.filter((country) => countryStatus(country.id) === status);
  return {
    countries: countries.length,
    population: countries.reduce((total, country) => total + country.population, 0),
    area: countries.reduce((total, country) => total + country.areaKm2, 0),
  };
}

function totalForRun() {
  return {
    countries: run.countries.length,
    population: run.countries.reduce((total, country) => total + country.population, 0),
    area: run.countries.reduce((total, country) => total + country.areaKm2, 0),
  };
}

function percentage(numerator, denominator) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function sound(kind) {
  try {
    audioContext ||= new AudioContext();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain); gain.connect(audioContext.destination);
    const now = audioContext.currentTime;
    const config = kind === 'success' ? [660, 880, .09] : kind === 'failure' ? [174, 104, .18] : [392, 392, .04];
    osc.frequency.setValueAtTime(config[0], now);
    osc.frequency.exponentialRampToValueAtTime(config[1], now + config[2]);
    gain.gain.setValueAtTime(.025, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + config[2] + .03);
    osc.start(now); osc.stop(now + config[2] + .04);
  } catch { /* audio is optional */ }
}

function haptic(pattern) {
  if ('vibrate' in navigator) navigator.vibrate(pattern);
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = message;
  document.body.append(el);
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 250); }, 1800);
}

function clearStoryTimer() {
  clearTimeout(storyTimer);
  storyTimer = null;
}

function renderIntro() {
  stopTimer(); clearStoryTimer(); mapController = null;
  app.innerHTML = `
    <section class="screen intro">
      <div>
        <div class="brand-mark"><span class="pulse"></span> WORLD DEFENCE TERMINAL / 196</div>
        <div class="intro-copy">
          <div class="eyebrow">GEOGRAPHIC AUTHENTICATION PROTOCOL</div>
          <h1>あなたの<br>知る世界</h1>
          <p class="subtitle">知らない国は、救えない。</p>
        </div>
      </div>
      <div>
        <p class="intro-brief">あなたは押してはいけないボタンを押した。地図上の照準を読み、4つの国名から正しい国を認証して、終末兵器の攻撃命令を止めよう。</p>
        <button class="primary-button" data-action="story">管制端末を起動する</button>
      </div>
    </section>`;
}

function renderStory(index = 0) {
  stopTimer(); clearStoryTimer(); mapController = null;
  const slide = STORY_SLIDES[index];
  const isLast = index === STORY_SLIDES.length - 1;
  app.innerHTML = `
    <section class="screen story-screen" style="--story-image: url('${slide.image}')">
      <div class="story-shade"></div>
      <div class="story-topline"><span>${slide.chapter}</span><span>${String(index + 1).padStart(2, '0')} / ${String(STORY_SLIDES.length).padStart(2, '0')}</span></div>
      <article class="story-copy">
        <div class="eyebrow">WORLD DEFENCE TERMINAL</div>
        <h2>${slide.title}</h2>
        <p>${slide.body}</p>
      </article>
      <div class="story-actions">
        <button class="primary-button" data-action="story-next" data-index="${index}">${isLast ? '管制端末へ進む' : '次へ'}</button>
        <button class="story-skip" data-action="modes">ストーリーをスキップ</button>
      </div>
    </section>`;
  storyTimer = setTimeout(() => {
    if (isLast) renderModes();
    else renderStory(index + 1);
  }, STORY_AUTO_ADVANCE_MS);
}

function renderModes() {
  stopTimer(); clearStoryTimer(); mapController = null;
  const regionalCards = Object.keys(REGIONS).filter((id) => id !== 'world').map((id) => {
    const region = REGIONS[id];
    const record = getRegionProgress(id);
    const count = gameData.regionCounts[id];
    const keyLabel = record.keys ? `管制キー ${'◆'.repeat(record.keys)}${'◇'.repeat(3 - record.keys)}` : '未奪還';
    return `<button class="mode-card" data-action="briefing" data-mode="${id}" data-quiz="choice">
      <span class="mode-name">${region.name}</span><span class="keys">${keyLabel}</span>
      <span class="mode-meta">${region.console}　/　${count}国・地域</span>
    </button>`;
  }).join('');
  const unlocked = isWorldUnlocked();
  app.innerHTML = `
    <section class="screen page">
      <header class="page-header"><div><div class="eyebrow">REGIONAL COMMAND</div><h2>作戦を選択</h2><p class="header-sub">6地域の管制権限を取り戻せ。</p></div><button class="back-button" data-action="intro">終了</button></header>
      <div class="mode-list">${regionalCards}
        <button class="mode-card ${unlocked ? '' : 'locked'}" data-action="briefing" data-mode="world" data-quiz="choice" ${unlocked ? '' : 'disabled'}>
          <span class="mode-name">全世界</span><span class="keys">${unlocked ? '最終作戦：開始可能' : 'LOCKED'}</span>
          <span class="mode-meta">中央管制システム　/　196国・地域</span>
        </button>
      </div>
      <p class="mode-note">地図の照準を読み、4つの国名から認証する。地域をC評価以上でクリアすると管制キーを獲得。</p>
  </section>`;
}

function renderQuizTypeSelect(modeId) {
  stopTimer(); clearStoryTimer(); mapController = null;
  const region = REGIONS[modeId];
  app.innerHTML = `
    <section class="screen page quiz-select-page">
      <header class="page-header"><div><div class="eyebrow">AUTHENTICATION MODE / ${region.short}</div><h2>${region.name}の認証方式</h2><p class="header-sub">地図を読む方法を選択してください。</p></div><button class="back-button" data-action="modes">戻る</button></header>
      <div class="quiz-type-list">
        <button class="quiz-type-card" data-action="briefing" data-mode="${modeId}" data-quiz="location">
          <span class="quiz-type-number">01</span><span class="quiz-type-kicker">STANDARD</span>
          <strong>${QUIZ_TYPES.location.name}</strong>
          <span>国名が表示されます。地図を動かして、その国をタップし、保護先として確定します。</span>
        </button>
        <button class="quiz-type-card reverse" data-action="briefing" data-mode="${modeId}" data-quiz="choice">
          <span class="quiz-type-number">02</span><span class="quiz-type-kicker">REVERSE / 4 CHOICES</span>
          <strong>${QUIZ_TYPES.choice.name}</strong>
          <span>地図上の照準地点を読み取り、同じ地域から選ばれた4つの国名で認証します。</span>
        </button>
      </div>
      <p class="mode-note">どちらの方式でも、地域クリア評価と管制キーの条件は共通です。</p>
    </section>`;
}

function renderBriefing(modeId, quizType = 'choice') {
  run = makeRun(modeId, quizType);
  const total = totalForRun();
  const region = REGIONS[modeId];
  const quiz = QUIZ_TYPES[quizType];
  app.innerHTML = `
    <section class="screen briefing">
      <div><div class="eyebrow">MISSION BRIEFING / ${region.short} / ${quiz.short}</div><h2>${region.name}を救出せよ</h2></div>
      <p class="lead">終末兵器の攻撃命令が、この地域へ向かっている。${quiz.briefing}</p>
      <div class="briefing-grid"><div><strong>${total.countries}</strong><span>対象国・地域</span></div><div><strong>${ROUND_SECONDS}</strong><span>1問の秒数（仮）</span></div><div><strong>196</strong><span>世界の総数</span></div></div>
      ${modeId === 'world' ? `<div class="mission-box">最終作戦。地域別作戦の結果は引き継がれない。残るのは、今回あなたが救えた世界だけだ。</div>` : `<div class="mission-box">地域クリア条件：正解率50%以上、救出国率60%以上、さらに人口または面積を70%以上救出。</div>`}
      <div class="briefing-actions"><button class="primary-button" data-action="start">${quiz.short}を開始する</button><button class="outline-button" data-action="modes">作戦選択へ戻る</button></div>
    </section>`;
}

function renderGame() {
  const region = REGIONS[run.modeId];
  const isChoice = run.quizType === 'choice';
  const headerCopy = isChoice ? '衛星照準 — 地図が示す国名を特定せよ' : '攻撃目標 — 国名と位置を照合せよ';
  const answerSheet = isChoice
    ? `<footer class="answer-sheet choice-sheet">
        <p class="selection-copy">照準された国を、同じ地域から選ばれた4つの国名で認証してください。</p>
        <div id="choice-grid" class="choice-grid" role="group" aria-label="国名の回答候補"></div>
        <div class="live-stats"><span id="live-save">救出 0</span><span id="live-loss">沈没 0</span><span id="live-pop">人口維持 —</span></div>
      </footer>`
    : `<footer class="answer-sheet">
        <p id="selection-copy" class="selection-copy">地図を動かし、保護する国をタップしてください。小さな国は照準マーカーをタップできます。</p>
        <div class="live-stats"><span id="live-save">救出 0</span><span id="live-loss">沈没 0</span><span id="live-pop">人口維持 —</span></div>
        <button id="confirm-button" class="primary-button" data-action="confirm" disabled>この領域を保護する</button>
      </footer>`;
  app.innerHTML = `
    <section class="screen game">
      <header class="mission-header">
        <div class="mission-topline"><span>${region.console} / ROUND <span id="round-number">01</span></span><span id="timer" class="timer" aria-label="残り時間">00:30</span></div>
        <p class="target-label">${headerCopy}</p>
        <h1 id="target-name" class="target-name">接続中…</h1>
        <div class="mission-progress" aria-hidden="true"><span id="timer-bar"></span></div>
      </header>
      <div class="map-stage"><svg id="map" role="img" aria-label="${isChoice ? '照準された国が表示される、パンとピンチズームができる地図' : 'パンとピンチズームができる世界地図。未解決の国をタップして選択します。'}"></svg><div class="map-controls"><button class="map-button" data-action="zoom-in" aria-label="地図を拡大">＋</button><button class="map-button" data-action="zoom-out" aria-label="地図を縮小">−</button><button class="map-button all" data-action="map-reset" aria-label="全体表示">全体</button></div></div>
      ${answerSheet}
    </section>`;
  initMap(false);
  nextQuestion();
}

function initMap(isResult) {
  const svg = d3.select('#map');
  if (svg.empty()) return;
  const width = 440;
  const height = isResult ? 280 : 470;
  svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
  const scopedFeatures = run?.modeId === 'world'
    ? gameData.map.features
    : gameData.map.features.filter((feature) => run?.ids.has(feature.properties.gameId));
  const projection = run?.modeId === 'world'
    ? d3.geoEqualEarth().rotate([-135, 0])
    : d3.geoMercator().rotate([-REGIONS[run.modeId].center[0], 0]);
  projection.fitExtent([[18, 18], [width - 18, height - 18]], { type: 'FeatureCollection', features: scopedFeatures });
  const path = d3.geoPath(projection);
  const viewport = svg.append('g').attr('class', 'map-viewport');
  const land = viewport.append('g').attr('class', 'land-layer');
  const effects = viewport.append('g').attr('class', 'effects-layer');
  const pins = viewport.append('g').attr('class', 'pin-layer');
  const paths = land.selectAll('path').data(gameData.map.features).join('path').attr('d', path)
    .attr('role', (feature) => run?.quizType === 'location' && feature.properties.gameId && run?.ids.has(feature.properties.gameId) && !byId[feature.properties.gameId].microstate ? 'button' : null)
    .attr('aria-label', (feature) => run?.quizType === 'location' && feature.properties.gameId && run?.ids.has(feature.properties.gameId)
      && !byId[feature.properties.gameId].microstate ? `${byId[feature.properties.gameId].name}を選択` : null);

  function visualClass(feature) {
    const id = feature.properties.gameId;
    if (!id || !run?.ids.has(id)) return 'country unplayable';
    const status = countryStatus(id);
    const country = byId[id];
    const bits = ['country', status, `color-${country.colorIndex}`];
    if (status === 'unresolved' && run.quizType === 'location') bits.push('playable');
    if (id === run.selectedId && run.phase === 'question') bits.push('selected');
    if (!isResult && run.quizType === 'choice' && run.phase === 'question' && status === 'unresolved') {
      bits.push(id === run.targetId ? 'choice-target' : 'choice-muted');
    }
    if (!isResult && run.phase === 'resolving' && run.answerResult?.target === id) {
      bits.push(run.answerResult.outcome === 'correct' ? 'answer-success' : 'answer-failure');
    }
    if (run.recentSunk?.has(id)) bits.push('sinking');
    return bits.join(' ');
  }

  function renderState() {
    paths
      .attr('class', visualClass)
      .attr('role', (feature) => {
        const id = feature.properties.gameId;
        return run.quizType === 'location' && id && run.ids.has(id) && countryStatus(id) === 'unresolved' && !byId[id].microstate ? 'button' : null;
      })
      .attr('aria-label', (feature) => {
        const id = feature.properties.gameId;
        return run.quizType === 'location' && id && run.ids.has(id) && countryStatus(id) === 'unresolved' && !byId[id].microstate ? `${byId[id].name}を選択` : null;
      });
    pins.selectAll('*').remove();
    effects.selectAll('*').remove();
    if (!run) return;
    run.countries.forEach((country) => {
      const status = countryStatus(country.id);
      const point = projection(country.anchor);
      if (!point) return;
      const [x, y] = point;
      if (status === 'saved') {
        pins.append('circle').attr('class', 'saved-ring').attr('cx', x).attr('cy', y).attr('r', 4.5);
        pins.append('image').attr('class', 'flag-pin').attr('href', country.flagAsset).attr('x', x - 6).attr('y', y - 4.5).attr('width', 12).attr('height', 9);
      } else if (!isResult && run.quizType === 'choice' && run.phase === 'question' && status === 'unresolved' && country.id === run.targetId) {
        pins.append('circle').attr('class', 'target-reticle outer').attr('cx', x).attr('cy', y).attr('r', 6);
        pins.append('circle').attr('class', 'target-reticle core').attr('cx', x).attr('cy', y).attr('r', 1.6);
      } else if (!isResult && run.quizType === 'location' && status === 'unresolved' && country.microstate) {
        const group = pins.append('g').attr('role', 'button').attr('aria-label', `${country.name}を選択`).on('click', (event) => { event.stopPropagation(); selectCountry(country.id); });
        group.append('circle').attr('class', 'assist-ring').attr('cx', x).attr('cy', y).attr('r', 4);
        group.append('circle').attr('class', 'assist-core').attr('cx', x).attr('cy', y).attr('r', 1.2);
      }
    });
    if (!isResult && run.phase === 'resolving' && run.answerResult) {
      const point = projection(byId[run.answerResult.target].anchor);
      if (point) effects.append('circle').attr('class', `answer-burst ${run.answerResult.outcome === 'correct' ? 'success' : 'failure'}`).attr('cx', point[0]).attr('cy', point[1]).attr('r', 7);
    }
    if (run.recentSunk?.size) {
      run.recentSunk.forEach((id) => {
        const point = projection(byId[id].anchor);
        if (point) effects.append('circle').attr('class', 'effect-ring effect-failure').attr('cx', point[0]).attr('cy', point[1]).attr('r', 8);
      });
    }
  }

  paths.on('click', (event, feature) => {
    if (isResult || run?.phase !== 'question' || run.quizType !== 'location') return;
    const id = feature.properties.gameId;
    if (!id || !run.ids.has(id)) {
      showToast('この地域の管制対象ではありません。');
      return;
    }
    if (countryStatus(id) !== 'unresolved') {
      showToast(countryStatus(id) === 'saved' ? 'この国はすでに保護済みです。' : 'この国はすでに沈没しました。');
      return;
    }
    selectCountry(id);
  });

  const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', (event) => viewport.attr('transform', event.transform));
  svg.call(zoom).on('dblclick.zoom', null);
  const initialTransform = d3.zoomIdentity;
  mapController = {
    update: renderState,
    zoomIn: () => svg.transition().duration(180).call(zoom.scaleBy, 1.5),
    zoomOut: () => svg.transition().duration(180).call(zoom.scaleBy, 1 / 1.5),
    reset: () => svg.transition().duration(300).call(zoom.transform, initialTransform),
  };
  svg.call(zoom.transform, initialTransform);
  renderState();
}

function updateMap() { mapController?.update(); }

function updateGameUI() {
  if (!run || run.phase === 'finished') return;
  const target = byId[run.targetId];
  const remaining = Math.max(0, Math.ceil((run.deadline - Date.now()) / 1000));
  const total = totalForRun(); const saved = sumFor('saved'); const sunk = sumFor('sunk');
  const timer = document.querySelector('#timer');
  const bar = document.querySelector('#timer-bar');
  const targetName = document.querySelector('#target-name');
  const round = document.querySelector('#round-number');
  if (timer) {
    timer.textContent = `00:${String(remaining).padStart(2, '0')}`;
    timer.className = `timer ${remaining <= 5 ? 'critical' : remaining <= 15 ? 'warning' : ''}`;
  }
  if (bar) { bar.style.width = `${(remaining / ROUND_SECONDS) * 100}%`; bar.style.background = remaining <= 5 ? 'var(--danger)' : remaining <= 15 ? 'var(--gold)' : 'var(--teal)'; }
  if (targetName) {
    targetName.innerHTML = run.quizType === 'choice'
      ? '照準地点を特定せよ'
      : target ? `${flagMarkup(target)} ${target.name}` : '接続中…';
  }
  if (round) round.textContent = String(run.round).padStart(2, '0');
  const save = document.querySelector('#live-save'); const loss = document.querySelector('#live-loss'); const pop = document.querySelector('#live-pop');
  if (save) save.textContent = `救出 ${saved.countries}`;
  if (loss) loss.textContent = `沈没 ${sunk.countries}`;
  if (pop) pop.textContent = `人口現存 ${percentage(total.population - sunk.population, total.population)}%`;
}

function updateSelectionUI() {
  const copy = document.querySelector('#selection-copy');
  const button = document.querySelector('#confirm-button');
  if (!copy || !button) return;
  if (run.selectedId) {
    copy.textContent = '選択中の領域を保護先として確定しますか？';
    button.disabled = false;
  } else {
    copy.textContent = '地図を動かし、保護する国をタップしてください。小さな国は照準マーカーをタップできます。';
    button.disabled = true;
  }
}

function selectCountry(id) {
  if (!run || run.quizType !== 'location' || run.phase !== 'question' || countryStatus(id) !== 'unresolved') return;
  run.selectedId = id;
  sound('tick'); haptic(8);
  updateMap(); updateSelectionUI();
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildChoiceIds(targetId) {
  const unresolved = activeUnresolved().filter((country) => country.id !== targetId);
  const resolved = run.countries.filter((country) => country.id !== targetId && countryStatus(country.id) !== 'unresolved');
  const wrongIds = shuffle([...unresolved, ...resolved]).slice(0, 3).map((country) => country.id);
  return shuffle([targetId, ...wrongIds]);
}

function renderChoiceOptions() {
  const grid = document.querySelector('#choice-grid');
  if (!grid || !run || run.quizType !== 'choice') return;
  const result = run.phase === 'resolving' ? run.answerResult : null;
  grid.innerHTML = run.choiceIds.map((id, index) => `
    <button class="choice-button ${result ? (id === result.target ? 'is-correct' : id === result.selected ? 'is-wrong' : 'is-muted') : ''}" data-action="choice" data-country="${id}" ${result ? 'disabled' : ''}>
      <span class="choice-number">${String(index + 1).padStart(2, '0')}</span><span>${byId[id].name}</span>${result && id === result.target ? '<span class="choice-state">正解</span>' : ''}${result && id === result.selected && id !== result.target ? '<span class="choice-state">選択</span>' : ''}
    </button>`).join('');
}

function nextQuestion() {
  const unresolved = activeUnresolved();
  if (!unresolved.length) { finishGame(); return; }
  run.recentSunk = new Set();
  run.answerResult = null;
  run.round += 1;
  run.selectedId = null;
  run.targetId = unresolved[Math.floor(Math.random() * unresolved.length)].id;
  run.choiceIds = run.quizType === 'choice' ? buildChoiceIds(run.targetId) : [];
  run.phase = 'question';
  run.deadline = Date.now() + ROUND_SECONDS * 1000;
  updateMap(); updateSelectionUI(); renderChoiceOptions(); updateGameUI();
  stopTimer(); timerHandle = setInterval(tick, 150);
}

function tick() {
  if (!run || run.phase !== 'question') return;
  const remaining = run.deadline - Date.now();
  updateGameUI();
  if (remaining <= 0) resolveTimeout();
  else if (remaining <= 5_000 && Math.ceil(remaining / 1000) !== Math.ceil((remaining + 150) / 1000)) { sound('tick'); haptic(10); }
}

function stopTimer() {
  if (timerHandle) clearInterval(timerHandle);
  timerHandle = null;
}

function confirmAnswer() {
  if (!run || run.quizType !== 'location' || run.phase !== 'question' || !run.selectedId) return;
  if (Date.now() >= run.deadline) { resolveTimeout(); return; }
  resolveAnswer(run.selectedId);
}

function answerChoice(selectedId) {
  if (!run || run.quizType !== 'choice' || run.phase !== 'question' || !run.choiceIds.includes(selectedId)) return;
  if (Date.now() >= run.deadline) { resolveTimeout(); return; }
  resolveAnswer(selectedId);
}

function resolveAnswer(selected) {
  stopTimer();
  const target = run.targetId;
  run.phase = 'resolving'; run.recentSunk = new Set();
  if (target === selected) {
    run.answerResult = { outcome: 'correct', target, selected };
    run.statuses[target] = { status: 'saved', savedAtRound: run.round };
    run.stats.correct += 1; run.stats.streak += 1; run.stats.maxStreak = Math.max(run.stats.maxStreak, run.stats.streak);
    run.answerLog.push({ target, selected, outcome: 'correct' });
    sound('success'); haptic([12, 35, 16]);
    showRoundResult(true, [target], '認証成功', `${byId[target].name}の攻撃命令を解除しました。`);
  } else {
    run.answerResult = { outcome: 'wrong', target, selected };
    const sunkIds = run.quizType === 'choice'
      ? [target]
      : [...new Set([target, selected])].filter((id) => countryStatus(id) === 'unresolved');
    sunkIds.forEach((id) => {
      run.statuses[id] = { status: 'sunk', sunkReason: id === target ? 'wrong_target' : 'wrong_selected', sunkAtRound: run.round };
    });
    run.recentSunk = new Set(sunkIds);
    run.stats.wrong += 1; run.stats.streak = 0;
    run.answerLog.push({ target, selected, outcome: 'wrong' });
    sound('failure'); haptic([45, 25, 75]);
    const message = run.quizType === 'choice'
      ? `誤った国名を選択しました。${byId[target].name}だけが沈没しました。`
      : sunkIds.length === 2
        ? `${byId[target].name} と ${byId[selected].name} が沈没しました。`
        : `${byId[target].name}の保護認証に失敗しました。`;
    showRoundResult(false, sunkIds, '認証失敗', message);
  }
  updateMap(); renderChoiceOptions(); updateGameUI();
}

function resolveTimeout() {
  if (!run || run.phase !== 'question') return;
  stopTimer();
  const target = run.targetId;
  run.phase = 'resolving';
  run.answerResult = { outcome: 'timeout', target, selected: null };
  run.statuses[target] = { status: 'sunk', sunkReason: 'timeout', sunkAtRound: run.round };
  run.recentSunk = new Set([target]);
  run.stats.timeout += 1; run.stats.streak = 0;
  run.answerLog.push({ target, selected: null, outcome: 'timeout' });
  sound('failure'); haptic([70, 30, 70]);
  showRoundResult(false, [target], '時間切れ', `${byId[target].name}の保護認証が間に合いませんでした。`);
  updateMap(); renderChoiceOptions(); updateGameUI();
}

function showRoundResult(success, ids, kicker, message) {
  const toast = document.createElement('div');
  toast.className = `result-toast ${success ? 'success' : 'failure'}`;
  const result = run.answerResult;
  const answerSummary = result?.outcome === 'wrong'
    ? `<div class="answer-summary"><span>正解</span><strong>${flagMarkup(byId[result.target])} ${byId[result.target].name}</strong><span>選択</span><strong class="wrong-answer">${flagMarkup(byId[result.selected])} ${byId[result.selected].name}</strong></div>`
    : `<h3>${ids.map((id) => `${flagMarkup(byId[id])} ${byId[id].name}`).join(' / ')}</h3>`;
  toast.innerHTML = `<div class="result-toast-inner"><div class="result-symbol">${success ? '✓' : '×'}</div><div class="result-kicker">${kicker}</div>${answerSummary}<p>${message}</p></div>`;
  document.querySelector('.game')?.append(toast);
  setTimeout(() => {
    toast.remove();
    if (!activeUnresolved().length) finishGame();
    else nextQuestion();
  }, EFFECT_DELAY || (success ? 1450 : 1900));
}

function calculateKey() {
  const saved = sumFor('saved'); const total = totalForRun(); const attempts = run.stats.correct + run.stats.wrong + run.stats.timeout;
  const accuracy = percentage(run.stats.correct, attempts);
  const countryRate = percentage(saved.countries, total.countries);
  const popRate = percentage(saved.population, total.population);
  const areaRate = percentage(saved.area, total.area);
  let keys = 0;
  if (accuracy >= 50 && countryRate >= 60 && (popRate >= 70 || areaRate >= 70)) keys = 1;
  if (accuracy >= 60 && countryRate >= 75 && popRate >= 75) keys = 2;
  if (accuracy >= 75 && countryRate >= 90 && popRate >= 90 && areaRate >= 90 && run.stats.maxStreak >= 8) keys = 3;
  return { keys, accuracy, countryRate, popRate, areaRate };
}

function finishGame() {
  stopTimer();
  if (!run || run.phase === 'finished') return;
  run.phase = 'finished';
  const evaluation = calculateKey();
  if (run.modeId !== 'world') {
    const old = getRegionProgress(run.modeId);
    progress[run.modeId] = { keys: Math.max(old.keys || 0, evaluation.keys), best: evaluation };
    saveProgress();
  }
  renderResults(evaluation);
}

function renderResults(evaluation) {
  const saved = sumFor('saved'); const sunk = sumFor('sunk'); const total = totalForRun();
  const sunkCountries = run.countries.filter((country) => countryStatus(country.id) === 'sunk');
  const label = run.modeId === 'world' ? '中央管制の最終記録' : `${REGIONS[run.modeId].name}管制区の記録`;
  const keyCopy = run.modeId === 'world'
    ? `<strong>${evaluation.countryRate >= 60 ? '世界は維持された。' : '世界は大きく失われた。'}</strong><br>これが、あなたの知る世界です。`
    : evaluation.keys
      ? `<strong>管制キー ${'◆'.repeat(evaluation.keys)}</strong><br>${REGIONS[run.modeId].name}の管制権限を奪還しました。${isWorldUnlocked() ? '全世界モードが解放されました。' : '残る地域の管制権限を奪還してください。'}`
      : `<strong>管制権限を奪還できなかった。</strong><br>正解率50%、救出国率60%、人口または面積70%を目標に、再挑戦してください。`;
  const list = sunkCountries.length ? sunkCountries.map((country) => `<li><span>${flagMarkup(country)} ${country.name}<br><small>${run.statuses[country.id].sunkReason === 'timeout' ? '時間切れ' : '認証混線'}</small></span><span><small>${formatPopulation(country.population)}<br>${formatArea(country.areaKm2)}</small></span></li>`).join('') : '<li>沈没した国はありません。</li>';
  app.innerHTML = `
    <section class="screen result-page">
      <div class="result-hero"><div class="eyebrow">MISSION RESULT</div><h2>${label}</h2><p>救えた国には旗が立ち、沈んだ国は海になった。</p></div>
      <div class="result-map-wrap"><svg id="map" role="img" aria-label="今回の最終世界地図"></svg><div class="result-note">ピンチで拡大・縮小できます</div></div>
      <dl class="score-grid"><div><dt>沈没 / 対象国数</dt><dd>${sunk.countries} <em>/ ${total.countries} 国</em></dd></div><div><dt>正解率</dt><dd>${evaluation.accuracy}<em>%</em></dd></div><div><dt>失われた人口</dt><dd class="loss-dd">${formatPopulation(sunk.population)}<em>/ ${formatPopulation(total.population)}（${percentage(sunk.population, total.population)}%）</em></dd></div><div><dt>失われた面積</dt><dd class="loss-dd">${formatArea(sunk.area)}<em>/ ${formatArea(total.area)}（${percentage(sunk.area, total.area)}%）</em></dd></div><div><dt>人口維持率</dt><dd>${percentage(saved.population, total.population)}<em>%</em></dd></div><div><dt>最大連続正解</dt><dd>${run.stats.maxStreak}<em> 連続</em></dd></div></dl>
      <div class="key-result">${keyCopy}</div>
      <ul class="sunk-list" aria-label="沈没国一覧">${list}</ul>
      <div class="result-actions"><button class="primary-button" data-action="retry">同じ作戦を再挑戦する</button><button class="outline-button" data-action="modes">作戦選択へ戻る</button></div>
    </section>`;
  initMap(true);
}

app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  const { action, mode, quiz, country } = button.dataset;
  if (action === 'intro') renderIntro();
  if (action === 'story') renderStory();
  if (action === 'story-next') {
    const nextIndex = Number(button.dataset.index) + 1;
    if (nextIndex >= STORY_SLIDES.length) renderModes();
    else renderStory(nextIndex);
  }
  if (action === 'modes') renderModes();
  if (action === 'quiz-type') renderQuizTypeSelect(mode);
  if (action === 'briefing') renderBriefing(mode, quiz);
  if (action === 'start') renderGame();
  if (action === 'confirm') confirmAnswer();
  if (action === 'choice') answerChoice(country);
  if (action === 'retry') renderBriefing(run.modeId, run.quizType);
  if (action === 'zoom-in') mapController?.zoomIn();
  if (action === 'zoom-out') mapController?.zoomOut();
  if (action === 'map-reset') mapController?.reset();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && run?.phase === 'question') updateGameUI();
});

async function bootstrap() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`データ読み込み失敗 (${response.status})`);
    gameData = await response.json();
    if (gameData.targetCount !== 196 || gameData.countries.length !== 196) throw new Error('196国データの検証に失敗しました');
    byId = Object.fromEntries(gameData.countries.map((country) => [country.id, country]));
    renderIntro();
  } catch (error) {
    app.innerHTML = `<section class="screen page"><div class="eyebrow">SYSTEM ERROR</div><h2>管制データを読み込めません</h2><p class="header-sub">${error.message}</p></section>`;
    console.error(error);
  }
}

bootstrap();
