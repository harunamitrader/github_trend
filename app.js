const snapshot = {
  date: "2026-03-24",
  repoCount: 14,
  todayStarsTotal: 21962,
  visibleMode: "Today",
  languages: [
    { label: "Python", count: 9 },
    { label: "TypeScript", count: 3 },
    { label: "JavaScript", count: 1 },
    { label: "言語未表示", count: 1 },
  ],
  themes: [
    {
      id: "agent-infra",
      label: "エージェント基盤",
      count: 7,
      title: "エージェントは「機能」ではなく「基盤」へ",
      description:
        "サンドボックス、メモリ、ブラウザ操作、スキル、MCP、ワークフロー接続といった運用レイヤーが主役になっていた。",
      evidence: ["deer-flow", "browser-use", "everything-claude-code", "n8n-mcp"],
    },
    {
      id: "finance",
      label: "収益化・金融自動化",
      count: 3,
      title: "出口が見えやすい領域に人気が集まる",
      description:
        "収益化や投資判断のように成果が想像しやすいテーマは、AI デモより強いフックになる。",
      evidence: ["MoneyPrinterV2", "TradingAgents", "TradingAgents-CN"],
    },
    {
      id: "model-learning",
      label: "モデル学習/実装",
      count: 2,
      title: "巨大モデル時代でも、軽量実装の学習需要は強い",
      description:
        "抽象化された API 利用だけでなく、モデルの中身を小さく再現して理解したい層が厚い。",
      evidence: ["tinygrad", "minimind"],
    },
    {
      id: "utility",
      label: "オフライン/実用インフラ",
      count: 2,
      title: "AI一色ではなく、手元で効く実用品も伸びる",
      description:
        "GitHub Trending は研究テーマの人気投票ではなく、人が今すぐ触りたいものの混合面として見るほうが正確。",
      evidence: ["project-nomad", "iptv"],
    },
  ],
};

const repositories = [
  {
    rank: 1,
    name: "FujiwaraChoki/MoneyPrinterV2",
    url: "https://github.com/FujiwaraChoki/MoneyPrinterV2",
    description: "Automate the process of making money online.",
    category: "finance",
    categoryLabel: "収益化・金融自動化",
    language: "Python",
    stars: 23003,
    forks: 2359,
    todayStars: 2902,
    license: "AGPL-3.0",
    insight: "収益化自動化をストレートに掲げたことで、AI の実利志向を強く映している。",
    caution: "成長自動化や外部サービス連携は、規約順守と再現性の確認が前提。",
  },
  {
    rank: 2,
    name: "bytedance/deer-flow",
    url: "https://github.com/bytedance/deer-flow",
    description:
      "An open-source SuperAgent harness that researches, codes, and creates.",
    category: "agent-infra",
    categoryLabel: "エージェント基盤",
    language: "Python",
    stars: 39537,
    forks: 4647,
    todayStars: 3569,
    license: "MIT",
    insight: "サンドボックス、メモリ、スキル、サブエージェントまで含んだ実行基盤として存在感が強い。",
    caution: "適用範囲が広い分、導入時はワークフロー設計と権限制御が重要。",
  },
  {
    rank: 3,
    name: "Crosstalk-Solutions/project-nomad",
    url: "https://github.com/Crosstalk-Solutions/project-nomad",
    description:
      "A self-contained, offline survival computer packed with critical tools, knowledge, and AI.",
    category: "utility",
    categoryLabel: "オフライン/実用インフラ",
    language: "TypeScript",
    stars: 13446,
    forks: 1267,
    todayStars: 4148,
    license: "Apache-2.0",
    insight: "AI とオフライン耐性を組み合わせた実用品として、かなり広い関心を集めている。",
    caution: "用途が多いほど、実機前提の保守やセットアップ難易度の確認が必要。",
  },
  {
    rank: 4,
    name: "browser-use/browser-use",
    url: "https://github.com/browser-use/browser-use",
    description: "Make websites accessible for AI agents. Automate tasks online with ease.",
    category: "agent-infra",
    categoryLabel: "エージェント基盤",
    language: "Python",
    stars: 83683,
    forks: 9733,
    todayStars: 1160,
    license: "MIT",
    insight: "Web 操作を AI エージェントへ開く基盤として、周辺ツールの土台になっている。",
    caution: "外部サイト操作はサイト側規約や認証設計との相性を必ず見るべき。",
  },
  {
    rank: 5,
    name: "TauricResearch/TradingAgents",
    url: "https://github.com/TauricResearch/TradingAgents",
    description: "TradingAgents: Multi-Agents LLM Financial Trading Framework",
    category: "finance",
    categoryLabel: "収益化・金融自動化",
    language: "Python",
    stars: 39370,
    forks: 7322,
    todayStars: 2521,
    license: "Apache-2.0",
    insight: "金融は AI エージェントの成果を想像しやすく、デモとしても実利としても強い。",
    caution: "実投資へ近づけるほど、説明責任とバックテストの厳密さが問われる。",
  },
  {
    rank: 6,
    name: "tinygrad/tinygrad",
    url: "https://github.com/tinygrad/tinygrad",
    description: "You like pytorch? You like micrograd? You love tinygrad!",
    category: "model-learning",
    categoryLabel: "モデル学習/実装",
    language: "Python",
    stars: 31889,
    forks: 3978,
    todayStars: 58,
    license: "MIT",
    insight: "軽量実装でモデルの仕組みを理解したい層の根強さを示す代表例。",
    caution: "学習用途には強いが、実運用フレームワークとして見ると別評価になる。",
  },
  {
    rank: 7,
    name: "affaan-m/everything-claude-code",
    url: "https://github.com/affaan-m/everything-claude-code",
    description:
      "The agent harness performance optimization system for Claude Code, Codex and beyond.",
    category: "agent-infra",
    categoryLabel: "エージェント基盤",
    language: "JavaScript",
    stars: 102056,
    forks: 13293,
    todayStars: 4453,
    license: "MIT",
    insight: "コーディングエージェント周辺の運用ノウハウが、単体プロダクト並みに注目されている。",
    caution: "実践知の集積型なので、自分の環境に合うものと合わないものの切り分けが必要。",
  },
  {
    rank: 8,
    name: "NousResearch/hermes-agent",
    url: "https://github.com/NousResearch/hermes-agent",
    description: "The agent that grows with you",
    category: "agent-infra",
    categoryLabel: "エージェント基盤",
    language: "Python",
    stars: 11600,
    forks: 1412,
    todayStars: 874,
    license: "MIT",
    insight: "継続利用とパーソナライズを前提にした“育つエージェント”の方向性が見える。",
    caution: "継続利用を価値にするなら、メモリ設計とプライバシーの整理が重要。",
  },
  {
    rank: 9,
    name: "jingyaogong/minimind",
    url: "https://github.com/jingyaogong/minimind",
    description: "Train a 26M-parameter GPT from scratch in just 2h.",
    category: "model-learning",
    categoryLabel: "モデル学習/実装",
    language: "Python",
    stars: 42594,
    forks: 5120,
    todayStars: 478,
    license: "Apache-2.0",
    insight: "小さな GPT を自分で追体験できる教材として、学習導線の強さがある。",
    caution: "わかりやすさは高いが、大規模モデル運用の複雑さとは切り分けて読むべき。",
  },
  {
    rank: 10,
    name: "hsliuping/TradingAgents-CN",
    url: "https://github.com/hsliuping/TradingAgents-CN",
    description: "Chinese-enhanced edition of TradingAgents based on multi-agent LLM trading.",
    category: "finance",
    categoryLabel: "収益化・金融自動化",
    language: "Python",
    stars: 20333,
    forks: 4281,
    todayStars: 672,
    license: "NOASSERTION",
    insight: "伸びたテーマが、そのまま各言語圏へローカライズされる流れを示す。",
    caution: "派生版は元プロジェクトとの差分や保守状態を確認して選ぶ必要がある。",
  },
  {
    rank: 11,
    name: "kepano/obsidian-skills",
    url: "https://github.com/kepano/obsidian-skills",
    description:
      "Agent skills for Obsidian. Teach your agent to use Markdown, Bases, JSON Canvas, and CLI.",
    category: "agent-infra",
    categoryLabel: "エージェント基盤",
    language: "言語未表示",
    stars: 16375,
    forks: 936,
    todayStars: 453,
    license: "MIT",
    insight: "エージェント活用が IDE だけでなく、個人知識管理の中にも入り始めている。",
    caution: "スキル資産はツール依存が強く、長期互換性は別途見ておきたい。",
  },
  {
    rank: 12,
    name: "czlonkowski/n8n-mcp",
    url: "https://github.com/czlonkowski/n8n-mcp",
    description: "A MCP for Claude Desktop / Claude Code / Windsurf / Cursor to build n8n workflows.",
    category: "agent-infra",
    categoryLabel: "エージェント基盤",
    language: "TypeScript",
    stars: 16068,
    forks: 2768,
    todayStars: 136,
    license: "MIT",
    insight: "エージェントと既存自動化基盤をつなぐ“橋”が人気カテゴリになっている。",
    caution: "接続点が増えるほど、権限境界と失敗時のロールバック設計が重要になる。",
  },
  {
    rank: 13,
    name: "iptv-org/iptv",
    url: "https://github.com/iptv-org/iptv",
    description: "Collection of publicly available IPTV channels from all over the world",
    category: "utility",
    categoryLabel: "オフライン/実用インフラ",
    language: "TypeScript",
    stars: 113609,
    forks: 5780,
    todayStars: 125,
    license: "Unlicense",
    insight: "AI 以外でも、更新され続ける実用データ集積は変わらず強い。",
    caution: "利用地域ごとの配信可用性や権利関係は別途確認が必要。",
  },
  {
    rank: 14,
    name: "hesreallyhim/awesome-claude-code",
    url: "https://github.com/hesreallyhim/awesome-claude-code",
    description:
      "A curated list of awesome skills, hooks, slash-commands, agent orchestrators, and plugins for Claude Code.",
    category: "agent-infra",
    categoryLabel: "エージェント基盤",
    language: "Python",
    stars: 30990,
    forks: 2162,
    todayStars: 413,
    license: "NOASSERTION",
    insight: "情報の洪水が起きるほど、整理された入口そのものが価値になる。",
    caution: "Awesome リストは広く浅くなりやすいので、採用時は一次ソース確認が必要。",
  },
];

const sources = [
  {
    title: "GitHub Trending",
    url: "https://github.com/trending",
    note: "2026-03-24 に `Today` 条件で確認したランキングページ。",
  },
  {
    title: "bytedance/deer-flow",
    url: "https://github.com/bytedance/deer-flow",
    note: "エージェント基盤カテゴリの代表例として参照。",
  },
  {
    title: "browser-use/browser-use",
    url: "https://github.com/browser-use/browser-use",
    note: "ブラウザ操作を AI エージェントへ渡す基盤として参照。",
  },
  {
    title: "affaan-m/everything-claude-code",
    url: "https://github.com/affaan-m/everything-claude-code",
    note: "コーディングエージェント運用ノウハウの集積として参照。",
  },
  {
    title: "Crosstalk-Solutions/project-nomad",
    url: "https://github.com/Crosstalk-Solutions/project-nomad",
    note: "AI以外の実用品トレンドも混在している例として参照。",
  },
];

const numberFormatter = new Intl.NumberFormat("ja-JP");
const maxLanguageCount = Math.max(...snapshot.languages.map((item) => item.count));
const maxTodayStars = Math.max(...repositories.map((repo) => repo.todayStars));

const snapshotStats = document.querySelector("#snapshot-stats");
const languageBreakdown = document.querySelector("#language-breakdown");
const signalCards = document.querySelector("#signal-cards");
const rankingList = document.querySelector("#ranking-list");
const filterChips = document.querySelector("#filter-chips");
const sourceList = document.querySelector("#source-list");
const themeSummary = document.querySelector("#theme-summary");

let activeFilter = "all";

renderSnapshot();
renderSignals();
renderFilters();
renderRanking();
renderSources();
renderThemeSummary();

function renderSnapshot() {
  const stats = [
    { label: "掲載リポジトリ", value: snapshot.repoCount, suffix: "件" },
    { label: "stars today 合計", value: snapshot.todayStarsTotal, suffix: "" },
    { label: "最多言語", value: "Python", suffix: "" },
    { label: "表示条件", value: snapshot.visibleMode, suffix: "" },
  ];

  snapshotStats.innerHTML = stats
    .map((stat) => {
      return `
        <article class="stat-card">
          <span>${stat.label}</span>
          <strong>${typeof stat.value === "number" ? numberFormatter.format(stat.value) : stat.value}${stat.suffix}</strong>
        </article>
      `;
    })
    .join("");

  languageBreakdown.innerHTML = snapshot.languages
    .map((item) => {
      const width = Math.max(12, Math.round((item.count / maxLanguageCount) * 100));
      return `
        <div class="progress-item">
          <div class="progress-row">
            <span>${item.label}</span>
            <strong>${item.count}件</strong>
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderSignals() {
  signalCards.innerHTML = snapshot.themes
    .map((theme) => {
      const tags = theme.evidence.map((item) => `<span class="tag">${item}</span>`).join("");
      return `
        <article class="signal-card">
          <div class="signal-head">
            <h3>${theme.title}</h3>
            <span class="signal-count">${theme.count} repos</span>
          </div>
          <p>${theme.description}</p>
          <div class="signal-tags">${tags}</div>
        </article>
      `;
    })
    .join("");
}

function renderFilters() {
  const filters = [{ id: "all", label: "すべて" }, ...snapshot.themes.map((theme) => ({ id: theme.id, label: theme.label }))];

  filterChips.innerHTML = filters
    .map((filter) => {
      const activeClass = filter.id === activeFilter ? " is-active" : "";
      const pressed = filter.id === activeFilter ? "true" : "false";
      return `<button class="filter-chip${activeClass}" type="button" data-filter="${filter.id}" aria-pressed="${pressed}">${filter.label}</button>`;
    })
    .join("");

  filterChips.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      renderFilters();
      renderRanking();
    });
  });
}

function renderRanking() {
  const filtered = repositories.filter((repo) => activeFilter === "all" || repo.category === activeFilter);

  rankingList.innerHTML = filtered
    .map((repo) => {
      const todayWidth = Math.max(6, Math.round((repo.todayStars / maxTodayStars) * 100));

      return `
        <article class="repo-card">
          <div class="repo-card-top">
            <span class="repo-rank">#${repo.rank}</span>
            <div>
              <h3><a href="${repo.url}" target="_blank" rel="noreferrer">${repo.name}</a></h3>
              <div class="repo-tags">
                <span class="tag">${repo.categoryLabel}</span>
                <span class="tag">${repo.language}</span>
                <span class="tag">${repo.license}</span>
              </div>
            </div>
          </div>

          <p class="repo-lead">${repo.description}</p>
          <p><strong>読み筋:</strong> ${repo.insight}</p>
          <p><strong>見るべき点:</strong> ${repo.caution}</p>

          <div class="metric-grid">
            <div class="metric">
              <span>Stars today</span>
              <strong>${numberFormatter.format(repo.todayStars)}</strong>
            </div>
            <div class="metric">
              <span>Total stars</span>
              <strong>${numberFormatter.format(repo.stars)}</strong>
            </div>
            <div class="metric">
              <span>Forks</span>
              <strong>${numberFormatter.format(repo.forks)}</strong>
            </div>
            <div class="metric">
              <span>Top比率</span>
              <strong>${todayWidth}%</strong>
            </div>
          </div>

          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width: ${todayWidth}%"></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSources() {
  sourceList.innerHTML = sources
    .map((source) => {
      return `
        <li>
          <strong><a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a></strong>
          <span>${source.note}</span>
        </li>
      `;
    })
    .join("");
}

function renderThemeSummary() {
  themeSummary.innerHTML = snapshot.themes
    .map((theme) => {
      return `
        <div class="theme-pill">
          <span>${theme.label}</span>
          <strong>${theme.count}</strong>
        </div>
      `;
    })
    .join("");
}
