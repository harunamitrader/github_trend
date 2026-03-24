const statsRoot = document.querySelector("#site-stats");
const todayRoot = document.querySelector("#today-articles");
const archiveRoot = document.querySelector("#archive-list");

load();

async function load() {
  const response = await fetch("./data/articles.json", { cache: "no-store" });
  const payload = await response.json();
  const articles = [...payload.articles].sort((left, right) => {
    return right.publishedAt.localeCompare(left.publishedAt);
  });

  const latestDate = articles[0]?.publishedAt ?? null;
  const todayArticles = latestDate
    ? articles.filter((article) => article.publishedAt === latestDate)
    : [];
  const archiveArticles = latestDate
    ? articles.filter((article) => article.publishedAt !== latestDate)
    : [];

  renderStats(articles, latestDate);
  renderToday(todayArticles, latestDate);
  renderArchive(archiveArticles);
}

function renderStats(articles, latestDate) {
  const items = [
    { label: "記事数", value: String(articles.length) },
    { label: "最終投稿日", value: latestDate ?? "-" },
    { label: "運用", value: "Codex manual" },
  ];

  statsRoot.innerHTML = items
    .map((item) => {
      return `
        <div class="stat-box">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `;
    })
    .join("");
}

function renderToday(articles, latestDate) {
  if (articles.length === 0) {
    todayRoot.innerHTML = `
      <div class="latest-box">
        <h3>まだ記事がありません。</h3>
        <p>Codex に「今日の記事作って」と頼むと、この欄に最新投稿日の記事が並びます。</p>
      </div>
    `;
    return;
  }

  todayRoot.innerHTML = articles
    .map((article) => {
      return `
        <article class="latest-box">
          <h3><a href="${article.articleUrl}">${article.title}</a></h3>
          <div class="article-meta">
            <span>${latestDate}</span>
            <span>${article.repoName}</span>
          </div>
          <p>${article.summary}</p>
          <a class="link-button" href="${article.articleUrl}">記事を読む</a>
        </article>
      `;
    })
    .join("");
}

function renderArchive(articles) {
  if (articles.length === 0) {
    archiveRoot.innerHTML = `
      <div class="archive-item">
        <h3>まだ過去記事はありません。</h3>
        <p>次回以降の更新から、この欄に当日分以外の記事が並びます。</p>
      </div>
    `;
    return;
  }

  archiveRoot.innerHTML = articles
    .map((article) => {
      return `
        <article class="archive-item">
          <h3><a href="${article.articleUrl}">${article.title}</a></h3>
          <div class="archive-meta">
            <span>${article.publishedAt}</span>
            <span>${article.repoName}</span>
          </div>
          <p>${article.summary}</p>
        </article>
      `;
    })
    .join("");
}
