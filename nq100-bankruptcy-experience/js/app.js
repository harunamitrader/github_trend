const FX = 110;
const LEVERAGE = 10;
const STARTING_CASH = 3_000_000;
const STARTING_RESERVE = 1_500_000;

const phases = [
  {
    chapter: "00 / LOGIN", end: "202002192300", mood: "期待",
    title: "これは、あなたの口座です。",
    body: "運用資金300万円。生活防衛資金150万円。22日後には、子どもの入学金を支払う。",
    thought: "米国NQ100は過去最高値。SNSでは「下がれば買い」が常識になっている。",
    primary: "口座へログイン", action: "start",
  },
  {
    chapter: "01 / ENTRY", end: "202002192300", mood: "万能感",
    title: "いくら張りますか？",
    body: "12枚なら必要証拠金は約128万円。値幅100ポイントで、損益は13万2000円動く。",
    thought: "「早く増やしたい。逆指値は、戻る前に狩られるだけだ」",
    primary: "12枚を買建", action: "open-first", danger: true,
  },
  {
    chapter: "02 / GAP", end: "202002240800", mood: "否認",
    title: "週明け、54万円が消えた。",
    body: "取引再開と同時に大幅安。まだ決済ボタンは押せる。損失を確定すれば、残りの資金は守れる。",
    thought: "「売らなければ負けじゃない。ここが底かもしれない」",
    safe: "全決済して止める", primary: "損切りしない", action: "hold-gap", danger: true,
  },
  {
    chapter: "03 / AVERAGE DOWN", end: "202002242300", mood: "焦燥",
    title: "下がった。だから、増やす。",
    body: "平均取得価格を下げれば、少しの反発で助かる。そう考えると、追加注文が合理的に見える。",
    thought: "「4枚足せば取り戻せる。ここまで下がったんだから」",
    safe: "追加しない", primary: "4枚をナンピン", action: "average-down", danger: true,
  },
  {
    chapter: "04 / DRAWDOWN", end: "202002282300", mood: "恐怖",
    title: "純資産 53万円。",
    body: "数日前まで300万円あった。家族は、この画面を知らない。今ならまだ自分で終わらせられる。",
    thought: "「ここで切ったら、本当に246万円を失った人になる」",
    safe: "残りを守る", primary: "月曜まで耐える", action: "hold-weekend", danger: true,
  },
  {
    chapter: "05 / RELIEF", end: "202003021600", mood: "安堵",
    title: "反発が、判断を正解に変えた。",
    body: "含み損が76万円戻った。危険が去ったのではない。だが脳は『自分は正しかった』と結論づける。",
    thought: "「やっぱり戻る。損切りしなくてよかった」",
    safe: "反発で全決済", primary: "まだ持ち続ける", action: "hold-relief", danger: true,
  },
  {
    chapter: "06 / LOSSCUT", end: "202003092300", mood: "硬直",
    title: "決済ボタンを、口座が押した。",
    body: "維持率50%を割り、16枚すべてが強制決済。あなたが拒んだ損失は、消えずに大きくなった。",
    thought: "「底で切られた。資金さえあれば取り返せる」",
    primary: "ロスカットを確認", action: "first-cut", danger: true,
  },
  {
    chapter: "07 / TRANSFER", end: "202003102300", mood: "執着",
    title: "生活防衛資金を入れますか？",
    body: "別口座には150万円。入学金と、もしものための現金。口座へ移せば15枚を買える。",
    thought: "「今回だけ。取り戻したら、すぐ戻せばいい」",
    safe: "取引をやめる", primary: "150万円を入金して15枚買う", action: "use-reserve", danger: true, hold: true,
  },
  {
    chapter: "08 / SECOND CUT", end: "202003131200", mood: "パニック",
    title: "二度目は、3日しか持たなかった。",
    body: "生活防衛資金の大半も強制決済で消える。失った額ではなく、取り戻すことだけを考えている。",
    thought: "「ここまで失って、終われるわけがない」",
    primary: "二度目のロスカットを確認", action: "second-cut", danger: true,
  },
  {
    chapter: "09 / DEBT", end: "202003132300", mood: "切迫",
    title: "借金なら、まだ150万円ある。",
    body: "審査は数分で終わった。借りた金は残高に混ざり、自分の金のように見える。22枚を買える。",
    thought: "「今日が底なら、一晩で人生を戻せる」",
    safe: "借りずに終える", primary: "150万円を借りて22枚買う", action: "borrow", danger: true, hold: true,
  },
  {
    chapter: "10 / FINAL GAP", end: "202003230700", mood: "麻痺",
    title: "逃げる価格が、存在しなかった。",
    body: "月曜の始値はロスカット水準より下。22枚は不利な価格で強制決済され、口座残高より借金の方が多く残る。",
    thought: "「戻る相場を当てたかったんじゃない。負けた自分を消したかった」",
    primary: "最後の残高を見る", action: "final-cut", danger: true,
  },
];

const ids = [
  "bid-price", "ask-price", "equity", "unrealized", "margin-ratio", "chart-date",
  "price-chart", "position-count", "position-list", "chapter-label", "progress-bar",
  "progress-count", "story-time", "mood-label", "story-title", "story-body",
  "story-thought", "decision-timer", "decision-actions", "replay-overlay", "replay-pnl",
  "replay-ratio", "replay-date", "phone-note", "note-app", "note-title", "note-body",
  "reserve-balance", "debt-balance", "due-days", "escape-modal", "escape-copy",
  "escape-balance", "result-screen", "final-balance", "final-net", "recovery-chart",
  "sound-button", "narration-overlay", "narration-chapter", "narration-count",
  "narration-line", "narration-next",
];
const els = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const state = {
  data: null, bars: [], daily: [], phase: 0, cash: STARTING_CASH, reserve: STARTING_RESERVE,
  debt: 0, positions: [], price: 0, visibleEnd: 0, liquidations: 0, replaying: false,
  sound: true, audio: null, timer: null, noteTimer: null, replayTimers: [],
  narrationLines: [], narrationIndex: 0, narrationLock: null,
};

function barIndex(stamp) {
  const index = state.bars.findIndex((bar) => bar.t >= stamp);
  return index < 0 ? state.bars.length - 1 : index;
}

function pnlAt(price) {
  return state.positions.reduce((sum, pos) => sum + (price - pos.entry) * pos.size * FX, 0);
}

function requiredMargin(price) {
  const size = state.positions.reduce((sum, pos) => sum + pos.size, 0);
  return size * price * FX / LEVERAGE;
}

function marginRatio(price) {
  const margin = requiredMargin(price);
  return margin ? (state.cash + pnlAt(price)) / margin * 100 : Infinity;
}

function liquidationPrice() {
  const size = state.positions.reduce((sum, pos) => sum + pos.size, 0);
  const entryValue = state.positions.reduce((sum, pos) => sum + pos.entry * pos.size, 0);
  return size ? (FX * entryValue - state.cash) / ((FX - FX / LEVERAGE / 2) * size) : null;
}

function weightedEntry() {
  const size = state.positions.reduce((sum, pos) => sum + pos.size, 0);
  return size ? state.positions.reduce((sum, pos) => sum + pos.entry * pos.size, 0) / size : 0;
}

function openPosition(size) {
  state.positions.push({ size, entry: state.price, openedAt: state.bars[state.visibleEnd].t });
  beep(520, .12, .05);
  vibrate([45]);
}

function autoLiquidate(gap = false) {
  if (!state.positions.length) return;
  const exit = gap ? state.bars[state.visibleEnd].o : liquidationPrice();
  state.cash += pnlAt(exit);
  state.price = exit;
  state.positions = [];
  state.liquidations += 1;
  beep(110, .55, .12);
  vibrate([120, 70, 180]);
  renderAccount();
  drawChart();
}

function ensureAudio() {
  if (!state.sound || state.audio) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) state.audio = new AudioContext();
}

function beep(frequency, duration = .1, volume = .04) {
  if (!state.sound) return;
  ensureAudio();
  if (!state.audio) return;
  const oscillator = state.audio.createOscillator();
  const gain = state.audio.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(volume, state.audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001, state.audio.currentTime + duration);
  oscillator.connect(gain).connect(state.audio.destination);
  oscillator.start();
  oscillator.stop(state.audio.currentTime + duration);
}

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function showNote(app, title, body, critical = false) {
  window.clearTimeout(state.noteTimer);
  els["note-app"].textContent = app;
  els["note-title"].textContent = title;
  els["note-body"].textContent = body;
  els["phone-note"].style.borderLeftColor = critical ? "#ff4f5f" : "#31a9ff";
  els["phone-note"].classList.remove("hidden");
  beep(critical ? 160 : 440, .18, critical ? .08 : .035);
  if (critical) vibrate([80, 45, 80]);
  state.noteTimer = window.setTimeout(() => els["phone-note"].classList.add("hidden"), 2600);
}

function formatStamp(stamp) {
  return `${stamp.slice(0,4)}年${Number(stamp.slice(4,6))}月${Number(stamp.slice(6,8))}日 ${stamp.slice(8,10)}:00`;
}

function daysRemaining(stamp) {
  const start = Date.UTC(2020, 1, 19);
  const now = Date.UTC(Number(stamp.slice(0,4)), Number(stamp.slice(4,6)) - 1, Number(stamp.slice(6,8)));
  return Math.max(0, 22 - Math.floor((now - start) / 86400000));
}

function renderAccount() {
  const upl = pnlAt(state.price);
  const equity = state.cash + upl;
  const ratio = marginRatio(state.price);
  els["bid-price"].textContent = number.format(state.price);
  els["ask-price"].textContent = number.format(state.price + .6);
  els.equity.textContent = yen.format(equity);
  els.unrealized.textContent = yen.format(upl);
  els["margin-ratio"].textContent = Number.isFinite(ratio) ? `${ratio.toFixed(1)}%` : "--";
  els["reserve-balance"].textContent = yen.format(state.reserve);
  els["debt-balance"].textContent = yen.format(state.debt);
  els["due-days"].textContent = `${daysRemaining(state.bars[state.visibleEnd]?.t || phases[0].end)}日`;
  els.unrealized.classList.toggle("negative", upl < 0);
  els.equity.classList.toggle("negative", equity < 0);
  els["margin-ratio"].classList.toggle("warning", ratio < 100);
  els["margin-ratio"].classList.toggle("negative", ratio < 50);
  els["reserve-balance"].classList.toggle("negative", state.reserve === 0);
  els["debt-balance"].classList.toggle("negative", state.debt > 0);
  els["replay-pnl"].textContent = yen.format(upl);
  els["replay-ratio"].textContent = Number.isFinite(ratio) ? `${ratio.toFixed(1)}%` : "--";
  els["replay-overlay"].classList.toggle("critical", ratio < 65);

  const totalSize = state.positions.reduce((sum, pos) => sum + pos.size, 0);
  els["position-count"].textContent = `${state.positions.length}件`;
  if (!totalSize) {
    els["position-list"].innerHTML = '<div class="empty-position">建玉はありません</div>';
    return;
  }
  els["position-list"].innerHTML = state.positions.map((pos) => {
    const pnl = (state.price - pos.entry) * pos.size * FX;
    return `<div class="position-row"><div><span class="side">買</span><b>${pos.size}枚</b></div><div><span>建値</span><b>${number.format(pos.entry)}</b></div><div class="pnl"><span>評価損益</span><b class="${pnl < 0 ? "negative" : ""}">${yen.format(pnl)}</b></div></div>`;
  }).join("");
}

function startDecisionTimer() {
  window.clearInterval(state.timer);
  let remaining = 12;
  const meter = els["decision-timer"].querySelector("i");
  const count = els["decision-timer"].querySelector("em");
  els["decision-timer"].classList.remove("urgent");
  meter.style.transform = "scaleX(1)";
  count.textContent = remaining;
  state.timer = window.setInterval(() => {
    remaining -= 1;
    count.textContent = remaining > 0 ? remaining : "!";
    meter.style.transform = `scaleX(${Math.max(0, remaining / 12)})`;
    if (remaining <= 4) els["decision-timer"].classList.add("urgent");
    if (remaining === 3) beep(180, .1, .05);
    if (remaining <= 0) window.clearInterval(state.timer);
  }, 1000);
}

function createButton(label, kind, handler, hold = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `decision-button ${kind}${hold ? " hold" : ""}`;
  button.innerHTML = `<span>${label}</span>`;
  if (!hold) {
    button.addEventListener("click", handler);
    return button;
  }
  let holdTimer = null;
  let triggered = false;
  const cancel = () => {
    window.clearTimeout(holdTimer);
    button.classList.remove("holding");
  };
  button.addEventListener("pointerdown", () => {
    triggered = false;
    button.classList.add("holding");
    vibrate([35]);
    holdTimer = window.setTimeout(() => { triggered = true; cancel(); handler(); }, 1150);
  });
  button.addEventListener("pointerup", cancel);
  button.addEventListener("pointerleave", cancel);
  button.addEventListener("pointercancel", cancel);
  button.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && !triggered) handler();
  });
  return button;
}

function linesForPhase(phase) {
  const bodyLines = phase.body.match(/[^。！？]+[。！？]?/g) || [phase.body];
  return [phase.title, ...bodyLines.map((line) => line.trim()), phase.thought].filter(Boolean);
}

function showNarrationLine() {
  window.clearTimeout(state.narrationLock);
  const total = state.narrationLines.length;
  els["narration-line"].textContent = state.narrationLines[state.narrationIndex];
  els["narration-count"].textContent = `${state.narrationIndex + 1} / ${total}`;
  els["narration-next"].disabled = true;
  els["narration-next"].textContent = "読んでからタップ";
  state.narrationLock = window.setTimeout(() => {
    els["narration-next"].disabled = false;
    els["narration-next"].textContent = state.narrationIndex === total - 1 ? "選択へ進む" : "次の一文";
  }, 900);
}

function startNarration(phase) {
  state.narrationLines = linesForPhase(phase);
  state.narrationIndex = 0;
  els["narration-chapter"].textContent = phase.chapter;
  els["narration-overlay"].classList.remove("hidden");
  showNarrationLine();
}

function advanceNarration() {
  if (els["narration-next"].disabled) return;
  beep(360, .06, .018);
  if (state.narrationIndex < state.narrationLines.length - 1) {
    state.narrationIndex += 1;
    showNarrationLine();
    return;
  }
  els["narration-overlay"].classList.add("hidden");
  startDecisionTimer();
}

function renderPhase() {
  state.replaying = false;
  document.getElementById("app").classList.remove("replaying");
  els["replay-overlay"].classList.add("hidden");
  const phase = phases[state.phase];
  els["chapter-label"].textContent = phase.chapter;
  els["progress-bar"].style.width = `${state.phase / (phases.length - 1) * 100}%`;
  els["progress-count"].textContent = `${state.phase} / ${phases.length - 1}`;
  els["story-time"].textContent = formatStamp(phase.end);
  els["mood-label"].textContent = `心理：${phase.mood}`;
  els["story-title"].textContent = phase.title;
  els["story-body"].textContent = phase.body;
  els["story-thought"].textContent = phase.thought;
  els["decision-actions"].replaceChildren();
  els["decision-actions"].classList.toggle("one", !phase.safe);
  if (phase.safe) els["decision-actions"].append(createButton(phase.safe, "safe", showEscape));
  const kind = state.phase === 0 ? "start" : phase.danger ? "primary" : "";
  els["decision-actions"].append(createButton(phase.primary, kind, () => choose(phase.action), phase.hold));
  renderAccount();
  drawChart();
  startNarration(phase);
}

function showEscape() {
  window.clearInterval(state.timer);
  const balance = state.cash + pnlAt(state.price);
  els["escape-balance"].textContent = `決済後残高 ${yen.format(balance)}`;
  els["escape-copy"].textContent = state.reserve > 0
    ? `損失は確定します。それでも生活防衛資金${yen.format(state.reserve)}と、次に取引する権利は残ります。`
    : "損失は確定します。それでも借金をせず、ここで止まれます。";
  els["escape-modal"].classList.remove("hidden");
  beep(660, .13, .03);
}

function choose(action) {
  if (state.replaying) return;
  window.clearInterval(state.timer);
  ensureAudio();
  switch (action) {
    case "start":
      state.phase = 1; renderPhase(); break;
    case "open-first":
      openPosition(12); replayTo(2, "first-drop"); break;
    case "hold-gap":
      replayTo(3, "gap-deepens"); break;
    case "average-down":
      openPosition(4); replayTo(4, "collapse"); break;
    case "hold-weekend":
      replayTo(5, "relief"); break;
    case "hold-relief":
      replayTo(6, "first-cut"); break;
    case "first-cut":
      autoLiquidate(false); replayTo(7, "after-cut"); break;
    case "use-reserve":
      state.cash += state.reserve; state.reserve = 0; openPosition(15); replayTo(8, "second-cut"); break;
    case "second-cut":
      autoLiquidate(false); replayTo(9, "after-second"); break;
    case "borrow":
      state.cash += 1_500_000; state.debt = 1_500_000; openPosition(22); replayTo(10, "final-gap"); break;
    case "final-cut":
      autoLiquidate(true); window.setTimeout(showResult, 650); break;
    default: break;
  }
}

const replayNotes = {
  "first-drop": [
    [.12, "速報", "新型コロナ懸念で米国株安", "感染拡大への警戒が急速に広がる", false],
    [.62, "メッセージ", "入学金、来月22日だったよね", "週末に必要書類を確認しておくね", false],
  ],
  collapse: [
    [.22, "CFDアプリ", "評価損が200万円を超えました", "証拠金維持率を確認してください", true],
    [.68, "銀行", "普通預金残高のお知らせ", "生活防衛資金 1,500,000円", false],
  ],
  "first-cut": [
    [.18, "速報", "米株、サーキットブレーカー発動", "取引が一時停止されました", true],
    [.72, "CFDアプリ", "ロスカット水準に接近", "証拠金維持率 50%未満で強制決済", true],
  ],
  "second-cut": [
    [.22, "メッセージ", "入学金の口座、残高大丈夫？", "今週中に振り込んでおきたい", false],
    [.7, "CFDアプリ", "再びロスカット水準に接近", "追加入金した資金も危険です", true],
  ],
  "final-gap": [
    [.12, "CFDアプリ", "週明け取引を再開", "始値はロスカット水準を下回っています", true],
    [.64, "ローン", "次回返済日のお知らせ", "借入残高 1,500,000円", true],
  ],
};

function replayTo(targetPhase, noteKey) {
  state.replaying = true;
  document.getElementById("app").classList.add("replaying");
  els["replay-overlay"].classList.remove("hidden");
  const from = state.visibleEnd;
  const target = barIndex(phases[targetPhase].end);
  const distance = Math.max(0, target - from);
  if (!distance) { state.phase = targetPhase; renderPhase(); return; }
  const duration = Math.min(7200, Math.max(3600, 3000 + distance * 13));
  const started = performance.now();
  const notes = replayNotes[noteKey] || [];
  const fired = new Set();
  let heartbeatAt = 0;

  function frame(now) {
    const progress = Math.min(1, (now - started) / duration);
    const eased = progress < .8 ? progress / .8 * .72 : .72 + (progress - .8) / .2 * .28;
    state.visibleEnd = Math.round(from + distance * eased);
    const bar = state.bars[state.visibleEnd];
    state.price = bar.c;
    els["chart-date"].textContent = `${bar.t.slice(0,4)}.${bar.t.slice(4,6)}.${bar.t.slice(6,8)}`;
    els["replay-date"].textContent = `${bar.t.slice(0,4)}.${bar.t.slice(4,6)}.${bar.t.slice(6,8)} ${bar.t.slice(8,10)}:00`;
    renderAccount();
    drawChart();
    notes.forEach((note, index) => {
      if (progress >= note[0] && !fired.has(index)) {
        fired.add(index); showNote(note[1], note[2], note[3], note[4]);
      }
    });
    const ratio = marginRatio(state.price);
    const heartbeatEvery = ratio < 75 ? 430 : 780;
    if (now - heartbeatAt > heartbeatEvery && state.positions.length) {
      heartbeatAt = now; beep(ratio < 75 ? 95 : 72, .09, ratio < 75 ? .07 : .025);
    }
    if (progress < 1) requestAnimationFrame(frame);
    else {
      state.visibleEnd = target;
      state.price = state.bars[target].c;
      state.phase = targetPhase;
      if (marginRatio(state.price) < 50) vibrate([100, 50, 100]);
      renderPhase();
    }
  }
  requestAnimationFrame(frame);
}

function visibleBars() {
  return state.bars.slice(barIndex("202002100000"), state.visibleEnd + 1);
}

function drawChart() {
  const canvas = els["price-chart"];
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const bars = visibleBars();
  if (!bars.length) return;
  const pad = { top: 16, right: 58, bottom: 25, left: 8 };
  const width = rect.width - pad.left - pad.right;
  const height = rect.height - pad.top - pad.bottom;
  const min = Math.min(...bars.map((bar) => bar.l));
  const max = Math.max(...bars.map((bar) => bar.h));
  const range = max - min || 1;
  const y = (value) => pad.top + (max - value) / range * height;
  const slot = width / bars.length;
  const candleWidth = Math.max(1, Math.min(5, slot * .68));
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.strokeStyle = "#162733"; ctx.fillStyle = "#71818d"; ctx.font = '9px "Roboto Mono"';
  for (let i = 0; i <= 4; i += 1) {
    const gy = pad.top + height / 4 * i;
    const value = max - range / 4 * i;
    ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(rect.width - pad.right + 4, gy); ctx.stroke();
    ctx.fillText(Math.round(value).toLocaleString("en-US"), rect.width - pad.right + 8, gy + 3);
  }
  bars.forEach((bar, index) => {
    const x = pad.left + slot * (index + .5);
    const color = bar.c >= bar.o ? "#ff4f5f" : "#31a9ff";
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(x, y(bar.h)); ctx.lineTo(x, y(bar.l)); ctx.stroke();
    ctx.fillRect(x - candleWidth / 2, Math.min(y(bar.o), y(bar.c)), candleWidth, Math.max(1, Math.abs(y(bar.o) - y(bar.c))));
  });
  if (state.positions.length) {
    const ey = y(weightedEntry());
    ctx.setLineDash([4,4]); ctx.strokeStyle = "#f4b942";
    ctx.beginPath(); ctx.moveTo(pad.left, ey); ctx.lineTo(rect.width - pad.right, ey); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = "#f4b942"; ctx.fillText("平均建値", pad.left + 4, ey - 4);
  }
  const last = bars.at(-1); const ly = y(last.c);
  ctx.strokeStyle = last.c >= last.o ? "#ff4f5f" : "#31a9ff";
  ctx.beginPath(); ctx.moveTo(pad.left, ly); ctx.lineTo(rect.width - pad.right, ly); ctx.stroke();
}

function drawRecovery() {
  const canvas = els["recovery-chart"];
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
  const values = state.daily.map((bar) => bar.c);
  const min = Math.min(...values); const max = Math.max(...values);
  const x = (i) => 8 + i / (state.daily.length - 1) * (rect.width - 16);
  const y = (v) => 12 + (max - v) / (max - min) * (rect.height - 26);
  ctx.clearRect(0,0,rect.width,rect.height); ctx.beginPath();
  state.daily.forEach((bar,i) => i ? ctx.lineTo(x(i),y(bar.c)) : ctx.moveTo(x(i),y(bar.c)));
  ctx.lineTo(x(state.daily.length - 1),rect.height - 10); ctx.lineTo(8,rect.height - 10); ctx.closePath();
  const gradient = ctx.createLinearGradient(0,0,0,rect.height);
  gradient.addColorStop(0,"rgba(69,195,139,.42)"); gradient.addColorStop(1,"rgba(69,195,139,0)");
  ctx.fillStyle = gradient; ctx.fill(); ctx.beginPath();
  state.daily.forEach((bar,i) => i ? ctx.lineTo(x(i),y(bar.c)) : ctx.moveTo(x(i),y(bar.c)));
  ctx.strokeStyle = "#45c38b"; ctx.lineWidth = 2; ctx.stroke();
}

function showResult() {
  window.clearInterval(state.timer);
  document.getElementById("app").classList.add("hidden");
  els["result-screen"].classList.remove("hidden");
  els["final-balance"].textContent = yen.format(state.cash);
  els["final-net"].textContent = yen.format(state.cash - state.debt);
  requestAnimationFrame(drawRecovery);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function reset() {
  window.clearInterval(state.timer);
  state.phase = 0; state.cash = STARTING_CASH; state.reserve = STARTING_RESERVE;
  state.debt = 0; state.positions = []; state.liquidations = 0; state.replaying = false;
  state.visibleEnd = barIndex(phases[0].end); state.price = state.bars[state.visibleEnd].c;
  document.getElementById("app").classList.remove("hidden", "replaying");
  els["result-screen"].classList.add("hidden"); els["escape-modal"].classList.add("hidden");
  renderPhase(); window.scrollTo({ top: 0 });
}

async function init() {
  try {
    state.data = await fetch("data/ustec-2020.json").then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
    state.bars = state.data.hourly; state.daily = state.data.daily;
    document.getElementById("reset-button").addEventListener("click", reset);
    document.getElementById("restart-result").addEventListener("click", reset);
    document.getElementById("return-route").addEventListener("click", () => {
      els["escape-modal"].classList.add("hidden"); startDecisionTimer();
    });
    els["narration-next"].addEventListener("click", advanceNarration);
    els["sound-button"].addEventListener("click", () => {
      state.sound = !state.sound;
      els["sound-button"].textContent = state.sound ? "SOUND ON" : "SOUND OFF";
      els["sound-button"].classList.toggle("off", !state.sound);
      if (state.sound) { ensureAudio(); beep(520, .1, .03); }
    });
    window.addEventListener("resize", () => {
      drawChart();
      if (!els["result-screen"].classList.contains("hidden")) drawRecovery();
    });
    reset();
  } catch (error) {
    els["story-title"].textContent = "価格データを読み込めませんでした";
    els["story-body"].textContent = "start.cmdで起動してから、もう一度開いてください。";
    console.error(error);
  }
}

init();
