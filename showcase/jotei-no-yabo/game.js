(() => {
  'use strict';

  const STORAGE_KEY = 'jotei-no-yabo-save-v1';
  const app = document.querySelector('#app');

  const CARDS = {
    precog: { name: '先見の明', mark: '◉', timing: '投資先を選ぶ前', detail: '上位候補2業種と下位候補3業種を示します。' },
    badhand: { name: '悪手看破', mark: '⌁', timing: '投資先を選ぶ前', detail: '史実基準で最も低い1業種を選択不能にします。' },
    stoploss: { name: '損切り命令', mark: '✂', timing: '投資決定前', detail: '下落時の総資産損失を最大-10%に抑えます。' },
    emergency: { name: '緊急撤退', mark: '↗', timing: '結果確認後', detail: '100%投資を50%投資へ変更します。利益も損失も半分です。' },
    attack: { name: '総攻め', mark: '⚔', timing: '100%投資の決定前', detail: 'ゲーム内騰落率を1.5倍にします。' },
    tenkabufu: { name: '天下布武', mark: '✦', timing: '100%投資の決定前', detail: 'ゲーム内騰落率を2.0倍にします。' }
  };

  // 数値はプロトタイプ用のイベント・業種別基準値。正式公開前に、出典付きの実測データへ差し替える。
  const EVENTS = [
    ['1949', '東京証券取引所再開', '戦後の取引所再開。焼け跡から復興へ向かう企業に、少しずつ資金が戻り始めています。', '復興局面では、生活と生産を支える産業へ資金が集まりました。', [['鉄鋼', '⚙', 18.6], ['銀行・金融', '▣', 11.2], ['建設', '▤', 14.8], ['食品', '◒', 5.7], ['運輸', '➤', 9.4]]],
    ['1950', '朝鮮戦争特需', '朝鮮半島の戦火を受け、特需の注文が国内企業へ流れ込んでいます。市場の熱気が急速に高まっています。', '朝鮮戦争特需は、日本の生産設備と輸出産業の回復を後押ししました。', [['鉄鋼', '⚙', 42.3], ['造船', '⚓', 38.1], ['機械', '⚒', 30.7], ['食品', '◒', 8.9], ['小売', '▥', 6.1]]],
    ['1964', '東京オリンピック', '世界中の視線が東京へ。道路・鉄道・宿泊施設など、都市を整える需要が盛り上がっています。', '五輪前後には都市インフラと消費の拡大が注目されました。', [['建設', '▤', 31.6], ['不動産', '⌂', 27.4], ['運輸', '➤', 20.2], ['電機', '◫', 17.3], ['食品', '◒', 6.8]]],
    ['1965', '証券不況', '景気の減速と株式市場の不安が広がり、強気の空気は急速に冷えています。資金を守る判断も必要です。', '証券不況では市場全体が厳しい局面となり、現金待機の価値が高まりました。', [['銀行・金融', '▣', -18.7], ['鉄鋼', '⚙', -21.4], ['電機', '◫', -10.6], ['食品', '◒', -4.8], ['医薬品', '✚', -2.9]]],
    ['1971', 'ニクソン・ショック', 'ドルと金の交換停止。為替制度の先行きが揺らぎ、輸出企業に警戒が広がっています。', '通貨制度の変化は、輸出依存度の高い企業に大きく影響しました。', [['自動車', '▰', -13.8], ['電機', '◫', -15.6], ['商社', '◇', -7.2], ['小売', '▥', 2.6], ['食品', '◒', 4.1]]],
    ['1973', '第一次オイルショック', '中東情勢の悪化で原油価格が急騰。国内では物価上昇と物不足が広がっています。', '資源関連が注目される一方、燃料や原材料を多く使う産業には重荷となりました。', [['石油・資源', '◉', 28.9], ['商社', '◇', 19.4], ['自動車', '▰', -18.6], ['電機', '◫', -13.2], ['小売・食品', '▥', 3.1]]],
    ['1979', '第二次オイルショック', '再び原油価格が上昇。省エネ技術と燃費性能をめぐる競争が、企業の明暗を分け始めています。', 'エネルギー効率の改善が、産業競争力を左右するテーマになりました。', [['自動車', '▰', 16.4], ['電機', '◫', 13.8], ['石油・資源', '◉', 9.6], ['商社', '◇', 6.2], ['小売', '▥', -4.7]]],
    ['1985', 'プラザ合意', '主要国が為替の調整に合意。急速な円高が進み、輸出企業の利益見通しが揺れています。', '円高は輸出産業の収益を圧迫する一方、内需系の追い風となる面もありました。', [['自動車', '▰', -12.9], ['電機', '◫', -10.7], ['不動産', '⌂', 19.8], ['銀行・金融', '▣', 14.2], ['小売', '▥', 8.5]]],
    ['1987', 'ブラックマンデー', '米国市場の急落が世界を駆け巡ります。東京の寄り付きにも緊張が走り、投資家は対応を迫られています。', '世界的な株価急落は、日本市場にも短期的な動揺をもたらしました。', [['銀行・金融', '▣', -19.4], ['不動産', '⌂', -16.8], ['電機', '◫', -11.6], ['食品', '◒', -4.4], ['医薬品', '✚', -2.7]]],
    ['1989', 'バブル相場最高値', '市場は連日の高値圏。土地と株はまだ上がるという声が、兜町を埋め尽くしています。', '1989年末、日経平均は史上最高値を記録しました。高揚の裏には過熱への警戒もありました。', [['不動産', '⌂', 30.8], ['銀行・金融', '▣', 24.5], ['商社', '◇', 16.7], ['電機', '◫', 10.2], ['食品', '◒', 4.1]]],
    ['1990', 'バブル崩壊', '株価は反落を続け、不動産と金融への不安が市場全体を覆っています。強気の資金繰りが重荷になります。', 'バブル崩壊後は資産価格の下落が長期化し、金融機関の不良債権問題へつながりました。', [['不動産', '⌂', -38.6], ['銀行・金融', '▣', -31.4], ['商社', '◇', -19.8], ['自動車', '▰', -13.4], ['食品', '◒', -4.2]]],
    ['1997', '金融危機', '金融機関の経営不安が表面化。信用の揺らぎが、企業と投資家の行動を慎重にさせています。', '金融危機では金融株が厳しい局面となり、守りの資産が選ばれやすくなりました。', [['銀行・金融', '▣', -35.2], ['不動産', '⌂', -22.1], ['商社', '◇', -14.6], ['通信', '◌', 5.7], ['医薬品', '✚', 4.8]]],
    ['1999', 'ITバブル', 'インターネット関連企業への期待が加速。新しい技術が、既存の産業構造を変えると語られています。', 'IT関連への期待が株価を押し上げ、成長株への資金流入が目立ちました。', [['インターネット', '◎', 44.8], ['通信', '◌', 32.6], ['電機', '◫', 23.4], ['自動車', '▰', 8.9], ['銀行・金融', '▣', 5.2]]],
    ['2008', 'リーマンショック', '米国の大手証券会社が破綻。世界の金融市場が連鎖的に下落し、国内企業にも急速に影響が広がります。', '世界金融危機は日本株にも大きな下落をもたらし、内外の需要が大きく冷え込みました。', [['銀行・金融', '▣', -41.5], ['自動車', '▰', -38.4], ['電機', '◫', -36.8], ['商社', '◇', -33.7], ['医薬品', '✚', -15.6]]],
    ['2013', '金融緩和', '大規模な金融緩和への期待で市場心理が転換。円安と企業収益の改善期待が株価を押し上げています。', '金融緩和局面では輸出・不動産・金融など幅広い業種が注目されました。', [['自動車', '▰', 33.7], ['不動産', '⌂', 29.1], ['銀行・金融', '▣', 25.6], ['電機', '◫', 22.4], ['食品', '◒', 9.3]]],
    ['2020', 'コロナショック', '感染症の拡大で人の移動と消費が急減。一方で、通信やデジタルサービスへの需要が急速に高まっています。', '感染拡大は市場を急落させた一方、デジタル関連の需要を押し上げる転機にもなりました。', [['通信・ネット', '◎', 19.6], ['ゲーム・娯楽', '♜', 17.2], ['医薬品', '✚', 10.4], ['小売・旅行', '▥', -23.8], ['運輸', '➤', -28.6]]]
  ].map(([year, title, news, memo, options]) => ({ year, title, news, memo, options: options.map(([name, icon, raw]) => ({ name, icon, raw })) }));

  const yen = n => `${Math.max(1, Math.floor(n)).toLocaleString('ja-JP')}円`;
  const pct = n => `${n > 0 ? '+' : ''}${n}%`;
  const trunc = n => n < 0 ? Math.ceil(n) : Math.floor(n);
  const xmur3 = str => { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return (h ^= h >>> 16) >>> 0; }; };
  const mulberry32 = a => () => { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const makeRng = seed => mulberry32(xmur3(seed)());
  const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));

  let state = null;

  function newGame(selectedCards) {
    const seed = `${Date.now()}-${Math.random()}`;
    const rng = makeRng(seed);
    const events = EVENTS.map(event => ({ ...event, options: event.options.map(option => {
      const base = trunc(option.raw);
      const range = Math.floor(Math.abs(base) * .20);
      const adjustment = Math.floor(rng() * (range * 2 + 1)) - range;
      return { ...option, base, adjustment, game: base + adjustment };
    }) }));
    state = { seed, events, eventIndex: 0, assets: 100000, peakAssets: 100000, selectedCards, usedCards: [], currentEffect: null, selection: null, allocation: null, phase: 'play', history: [], emergencyApplied: false, rivals: { ran: 100000, chiyo: 100000, ogin: 100000 } };
    save();
  }

  function save() { if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function clearSave() { localStorage.removeItem(STORAGE_KEY); }
  function currentEvent() { return state.events[state.eventIndex]; }
  function selectedOption() { return state.selection === 'cash' ? null : currentEvent().options.find(o => o.name === state.selection); }
  function cardAvailable(id) { return state.selectedCards.includes(id) && !state.usedCards.includes(id); }
  function getRank() { const all = [{ id: 'you', assets: state.assets }, ...Object.entries(state.rivals).map(([id, assets]) => ({ id, assets }))]; return all.sort((a, b) => b.assets - a.assets).findIndex(x => x.id === 'you') + 1; }

  function renderTitle() {
    app.innerHTML = `<section class="game-page"><img class="hero-art" src="assets/empress-key-visual.png" alt=""><header class="topbar"><div class="wordmark"><strong>女帝の野望</strong><span>KABUTOCHO CHRONICLE</span></div><button class="top-action" data-action="howto">遊び方</button></header><div class="title-wrap"><div class="title-panel"><span class="eyebrow">日本株・歴史戦略遊戯</span><h1>女帝の野望</h1><p class="lead">戦後の焼け跡から、現代の最高値まで。史実を手がかりに国内業種へ資金を投じ、兜町の頂へ登り詰めよ。</p><div class="title-points"><span>全16局面</span><span>現金＋国内5業種</span><span>30〜60分</span><span>史実連動</span></div><button class="start-button" data-action="setup">女帝として相場に臨む</button><small class="tiny">※これはゲーム用に抽象化したフィクションです。実際の投資判断を目的とするものではありません。</small></div></div></section>`;
  }

  function renderSetup(selected = []) {
    const cardList = Object.entries(CARDS).map(([id, card]) => `<button class="empress-card ${selected.includes(id) ? 'selected' : ''} ${!selected.includes(id) && selected.length === 4 ? 'disabled' : ''}" data-card-select="${id}"><span class="card-mark">${card.mark}</span><strong>${card.name}</strong><small>${card.timing}<br>${card.detail}</small></button>`).join('');
    app.innerHTML = `<section class="game-page"><img class="hero-art" src="assets/empress-key-visual.png" alt=""><header class="topbar"><div class="wordmark"><strong>女帝の野望</strong><span>PREPARE THE COURT</span></div><button class="top-action" data-action="title">戻る</button></header><div class="setup"><div class="section-head"><span class="eyebrow">御前会議</span><h2>女帝カードを4枚選べ</h2><p>情報を得るか、危機を凌ぐか、天下を賭けるか。選んだ4枚だけを、1ゲームに各1回使えます。</p></div><div class="card-select-grid">${cardList}</div><div class="setup-bottom"><span class="selection-count ${selected.length === 4 ? 'ready' : ''}">選択中 <b>${selected.length}</b> / 4</span><button class="start-button" data-action="begin" ${selected.length !== 4 ? 'disabled' : ''}>相場を始める</button></div></div></section>`;
    state = { setupSelected: selected };
  }

  function renderPlay() {
    const event = currentEvent();
    const chosen = selectedOption();
    const isCash = state.selection === 'cash';
    const active = state.currentEffect ? CARDS[state.currentEffect] : null;
    const choices = [`<button class="choice ${isCash ? 'selected' : ''}" data-choice="cash"><span class="choice-icon">▣</span><span class="choice-name">現金</span></button>`, ...event.options.map(option => {
      const hint = state.currentEffect === 'precog' ? (topTwo(event).includes(option.name) ? '<i class="choice-hint">上位候補</i>' : '<i class="choice-hint low">下位候補</i>') : '';
      const disabled = state.currentEffect === 'badhand' && worstByBase(event).name === option.name;
      return `<button class="choice ${state.selection === option.name ? 'selected' : ''}" data-choice="${escapeHTML(option.name)}" ${disabled ? 'disabled' : ''}><span class="choice-icon">${option.icon}</span><span class="choice-name">${option.name}</span>${hint}</button>`;
    })].join('');
    const cardButtons = state.selectedCards.map(id => {
      const card = CARDS[id];
      const unavailable = !cardAvailable(id) || (state.currentEffect && state.currentEffect !== id) || ((id === 'attack' || id === 'tenkabufu') && state.allocation !== 1);
      return `<button class="in-play-card" data-card-use="${id}" ${unavailable ? 'disabled' : ''}><span class="card-mark">${card.mark}</span><span><strong>${card.name}</strong><small>${card.timing}</small></span></button>`;
    }).join('');
    let summary = '投資先を選択してください。';
    if (isCash) summary = '現金で待機します。今回の資産変化は0%です。';
    if (chosen && state.allocation) summary = `<b>${chosen.name}</b>に<b>${state.allocation === 1 ? '全軍投入 100%' : '半陣 50%'}</b>で臨みます。`;
    const canConfirm = isCash || (chosen && state.allocation);
    app.innerHTML = `<section class="game-page"><img class="hero-art" src="assets/empress-key-visual.png" alt=""><header class="topbar"><div class="wordmark"><strong>女帝の野望</strong><span>TURN ${state.eventIndex + 1} / ${state.events.length}</span></div><button class="top-action" data-action="howto">遊び方</button></header><div class="play-wrap"><div class="hud"><div class="hud-item"><span class="hud-label">総資産</span><span class="hud-value">${yen(state.assets)}</span></div><div class="hud-item"><span class="hud-label">現在の局面</span><span class="hud-value">${event.year}年</span></div><div class="hud-item"><span class="hud-label">兜町順位</span><span class="hud-value">${getRank()}位</span><span class="rank-row"><span>蘭 ${yen(state.rivals.ran)}</span><span>千代 ${yen(state.rivals.chiyo)}</span></span></div></div><div class="event-layout"><article class="event-panel"><span class="event-year">HISTORICAL EVENT / ${event.year}</span><h2 class="event-title">${event.title}</h2><p class="event-news">${event.news}</p><p class="event-rule"><b>今局面の相場</b>は、史実基準騰落率を中心に、絶対値の20%以内で1%刻みに変動します。小数点以下は切り捨てです。</p></article><aside class="card-panel"><h3>女帝カード</h3>${cardButtons}<div class="active-card-message">${active ? `「${active.name}」を使用中 — ${active.detail}` : 'カードは同じ局面で1枚まで使用できます。'}</div></aside></div><section class="choice-area"><h3 class="choice-heading">今、何を保有する？</h3><div class="choice-grid">${choices}</div><div class="allocation" ${isCash || !chosen ? 'hidden' : ''}><button class="allocation-button ${state.allocation === .5 ? 'selected' : ''}" data-allocation="0.5"><b>半陣 50%</b><small>半分は現金に残す</small></button><button class="allocation-button ${state.allocation === 1 ? 'selected' : ''}" data-allocation="1"><b>全軍投入 100%</b><small>利益も損失も全て受ける</small></button></div><div class="decision-row"><span class="decision-summary">${summary}</span><button class="confirm-button" data-action="confirm" ${!canConfirm ? 'disabled' : ''}>投資を決定する</button></div></section></div></section>`;
  }

  function topTwo(event) { return [...event.options].sort((a, b) => b.base - a.base).slice(0, 2).map(o => o.name); }
  function worstByBase(event) { return [...event.options].sort((a, b) => a.base - b.base)[0]; }

  function useCard(id) {
    if (!cardAvailable(id) || state.currentEffect) return;
    if ((id === 'attack' || id === 'tenkabufu') && state.allocation !== 1) return;
    state.currentEffect = id;
    state.usedCards.push(id);
    if (id === 'badhand' && state.selection === worstByBase(currentEvent()).name) { state.selection = null; state.allocation = null; }
    save(); renderPlay();
  }

  function calculateReturn(option, allocation, effect) {
    if (!option) return { rawReturn: 0, assetChange: 0, nextAssets: state.assets };
    let rawReturn = option.game;
    if (effect === 'attack') rawReturn = trunc(rawReturn * 1.5);
    if (effect === 'tenkabufu') rawReturn = trunc(rawReturn * 2);
    let assetChange = rawReturn * allocation;
    if (effect === 'stoploss' && assetChange < -10) assetChange = -10;
    let nextAssets = Math.floor(state.assets * (1 + assetChange / 100));
    if (effect === 'tenkabufu' && assetChange <= -100) nextAssets = Math.max(1, Math.floor(state.assets * .01));
    else nextAssets = Math.max(1, nextAssets);
    return { rawReturn, assetChange, nextAssets };
  }

  function updateRivals(event) {
    const rng = makeRng(`${state.seed}-rival-${state.eventIndex}`);
    const sorted = [...event.options].sort((a, b) => b.game - a.game);
    const choose = (type) => {
      if (type === 'ran') return rng() < .72 ? sorted[Math.floor(rng() * 2)] : event.options[Math.floor(rng() * 5)];
      if (type === 'chiyo') return rng() < .55 ? null : sorted[Math.floor(rng() * 4)];
      return rng() < .72 ? sorted[Math.floor(rng() * 2)] : event.options[Math.floor(rng() * 5)];
    };
    const allocation = { ran: rng() < .72 ? 1 : .5, chiyo: rng() < .6 ? .5 : 0, ogin: rng() < .6 ? 1 : .5 };
    Object.keys(state.rivals).forEach(type => {
      const option = choose(type);
      const rate = option ? option.game * allocation[type] : 0;
      state.rivals[type] = Math.max(1, Math.floor(state.rivals[type] * (1 + rate / 100)));
    });
  }

  function confirmInvestment() {
    const option = selectedOption();
    const allocation = state.selection === 'cash' ? 0 : state.allocation;
    if (state.selection !== 'cash' && (!option || !allocation)) return;
    const calculation = calculateReturn(option, allocation, state.currentEffect);
    state.pending = { option, allocation, effect: state.currentEffect, ...calculation, beforeAssets: state.assets };
    state.assets = calculation.nextAssets;
    state.peakAssets = Math.max(state.peakAssets, state.assets);
    updateRivals(currentEvent());
    state.phase = 'result';
    save(); renderResult();
  }

  function renderResult() {
    const event = currentEvent();
    const p = state.pending;
    const rows = [{ name: '現金', icon: '▣', game: 0 }, ...event.options].sort((a, b) => b.game - a.game).map((option, index) => {
      const isPlayer = (p.option && option.name === p.option.name) || (!p.option && option.name === '現金');
      const cls = option.game > 0 ? 'positive' : option.game < 0 ? 'negative' : 'flat';
      return `<div class="return-row ${isPlayer ? 'player' : ''}"><span>${index + 1}</span><span>${option.icon || '▣'} ${option.name}${isPlayer ? '　← あなた' : ''}</span><b class="${cls}">${pct(option.game)}</b></div>`;
    }).join('');
    const changeClass = p.assetChange > 0 ? '' : p.assetChange < 0 ? 'loss' : 'neutral';
    const detail = p.option ? `${p.option.name} ${pct(p.rawReturn)} ／ ${p.allocation === 1 ? '全軍投入 100%' : '半陣 50%'}` : '現金で待機 0%';
    const effectText = p.effect ? `「${CARDS[p.effect].name}」を使用` : '女帝カードは未使用';
    const canEmergency = cardAvailable('emergency') && p.allocation === 1 && !state.emergencyApplied;
    app.innerHTML = `<section class="game-page"><header class="topbar"><div class="wordmark"><strong>女帝の野望</strong><span>RESULT ${state.eventIndex + 1} / ${state.events.length}</span></div></header><div class="result-wrap"><section class="result-hero"><p class="result-kicker">${event.year}年　${event.title}</p><h2 class="result-title">${p.assetChange > 0 ? '大勝利' : p.assetChange < 0 ? '敗走' : '籠城'}</h2><div class="result-change ${changeClass}">${p.assetChange > 0 ? '+' : ''}${p.assetChange}%</div><p class="result-desc">${detail}<br>${effectText}<br>資産: ${yen(p.beforeAssets)} → <b>${yen(state.assets)}</b></p></section><div class="result-grid"><section class="result-table"><h3>今局面の結果</h3>${rows}</section><section class="memo-panel"><h3>史実メモ</h3><p>${event.memo}</p></section></div><div class="result-actions">${canEmergency ? '<button class="emergency-button" data-action="emergency">緊急撤退を発令する</button>' : ''}<button class="next-button" data-action="next">${state.eventIndex === state.events.length - 1 ? '最終決算へ' : '次の局面へ'}</button></div></div></section>`;
  }

  function useEmergency() {
    const p = state.pending;
    if (!cardAvailable('emergency') || p.allocation !== 1 || state.emergencyApplied) return;
    const before = p.beforeAssets;
    const recalculated = calculateReturn(p.option, .5, null);
    state.assets = recalculated.nextAssets;
    state.peakAssets = Math.max(state.peakAssets, state.assets);
    p.allocation = .5; p.assetChange = recalculated.assetChange; p.nextAssets = recalculated.nextAssets; p.effect = 'emergency'; p.rawReturn = p.option.game;
    state.usedCards.push('emergency'); state.emergencyApplied = true;
    // ライバルは既に確定済み。プレイヤーだけ撤退し、結果画面を再描画する。
    save(); renderResult();
  }

  function nextEvent() {
    const p = state.pending;
    state.history.push({ event: currentEvent().title, assets: state.assets, option: p.option ? p.option.name : '現金', allocation: p.allocation, assetChange: p.assetChange, effect: p.effect });
    state.eventIndex++;
    state.selection = null; state.allocation = null; state.currentEffect = null; state.pending = null; state.emergencyApplied = false;
    if (state.eventIndex >= state.events.length) { state.phase = 'final'; save(); renderFinal(); return; }
    state.phase = 'play'; save(); renderPlay();
  }

  function titleForAssets(assets, rank) {
    if (rank === 1 && assets >= 650000) return '天下無双の女帝';
    if (rank === 1) return '相場の女帝';
    if (assets >= 350000) return '兜町の女王';
    if (assets >= 180000) return '投資大名';
    if (assets >= 100000) return '相場の姫';
    return '兜町の見習い';
  }

  function renderFinal() {
    const rank = getRank();
    const topChoices = state.history.filter(x => x.assetChange > 0).length;
    const fullInvests = state.history.filter(x => x.allocation === 1).length;
    app.innerHTML = `<section class="game-page"><img class="hero-art" src="assets/empress-key-visual.png" alt=""><header class="topbar"><div class="wordmark"><strong>女帝の野望</strong><span>FINAL AUDIENCE</span></div></header><div class="final-wrap"><div class="final-emblem">✦</div><p class="eyebrow">最終決算</p><h2>${titleForAssets(state.assets, rank)}</h2><p class="final-sub">1949年から2020年まで、あなたは市場の荒波を越えました。</p><div class="final-assets">${yen(state.assets)}</div><p class="final-rank">兜町順位　${rank} 位 / 4 人</p><div class="record-grid"><div class="record"><span>最高資産</span><b>${yen(state.peakAssets)}</b></div><div class="record"><span>100%投資</span><b>${fullInvests} 回</b></div><div class="record"><span>利益を得た局面</span><b>${topChoices} / ${state.events.length}</b></div><div class="record"><span>使用した女帝カード</span><b>${state.usedCards.length} 枚</b></div></div><button class="start-button" data-action="restart">もう一度、天下を目指す</button></div></section>`;
  }

  function openHowTo() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `<section class="modal" role="dialog" aria-modal="true" aria-label="遊び方"><h2>遊び方</h2><p>各局面で、<b>現金または国内5業種</b>から1つを選びます。現金なら0%、業種を選ぶなら50%か100%を選択します。</p><ul><li>業種の騰落率は、史実基準を中心に絶対値の20%以内で変動します。</li><li>ゲーム内の業種騰落率は1%刻みで、小数点以下は切り捨てです。</li><li>女帝カードは最初に4枚選び、各1回だけ使えます。同じ局面で使えるのは1枚までです。</li><li>これは歴史を題材にしたゲームです。実際の投資判断には使用しないでください。</li></ul><button data-action="closemodal">閉じる</button></section>`;
    document.body.append(modal);
  }

  app.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'howto') { openHowTo(); return; }
    if (action === 'setup') { renderSetup([]); return; }
    if (action === 'title') { renderTitle(); return; }
    if (action === 'begin') { newGame(state.setupSelected); renderPlay(); return; }
    if (action === 'confirm') { confirmInvestment(); return; }
    if (action === 'next') { nextEvent(); return; }
    if (action === 'emergency') { useEmergency(); return; }
    if (action === 'restart') { clearSave(); renderSetup([]); return; }
    if (button.dataset.cardSelect) { const id = button.dataset.cardSelect; const selected = [...state.setupSelected]; const position = selected.indexOf(id); if (position >= 0) selected.splice(position, 1); else if (selected.length < 4) selected.push(id); renderSetup(selected); return; }
    if (button.dataset.cardUse) { useCard(button.dataset.cardUse); return; }
    if (button.dataset.choice) { state.selection = button.dataset.choice; state.allocation = null; if (state.currentEffect === 'attack' || state.currentEffect === 'tenkabufu') { state.usedCards = state.usedCards.filter(x => x !== state.currentEffect); state.currentEffect = null; } save(); renderPlay(); return; }
    if (button.dataset.allocation) { state.allocation = Number(button.dataset.allocation); if ((state.currentEffect === 'attack' || state.currentEffect === 'tenkabufu') && state.allocation !== 1) { state.usedCards = state.usedCards.filter(x => x !== state.currentEffect); state.currentEffect = null; } save(); renderPlay(); }
  });
  document.body.addEventListener('click', event => { if (event.target.dataset.action === 'closemodal' || event.target.classList.contains('modal-backdrop')) event.target.closest('.modal-backdrop')?.remove(); });

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.events && saved.phase !== 'final') { state = saved; if (state.phase === 'result' && state.pending) renderResult(); else renderPlay(); }
    else renderTitle();
  } catch { clearSave(); renderTitle(); }
})();
