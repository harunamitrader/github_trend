const statsRoot = document.querySelector("#site-stats");
const latestRoot = document.querySelector("#latest-article");
const archiveRoot = document.querySelector("#archive-list");

load();

async function load() {
  const response = await fetch("./data/articles.json", { cache: "no-store" });
  const payload = await response.json();
  const articles = [...payload.articles].sort((left, right) => {
    return right.publishedAt.localeCompare(left.publishedAt);
  });

  renderStats(articles);
  renderLatest(articles[0]);
  renderArchive(articles);
}

function renderStats(articles) {
  const latest = articles[0];
  const items = [
    { label: "記事数", value: String(articles.length) },
    { label: "最終更新", value: latest ? latest.publishedAt : "-" },
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

function renderLatest(article) {
  if (!article) {
    latestRoot.innerHTML = `
      <div class="latest-box">
        <h3>まだ記事はありません。</h3>
        <p>毎朝 Codex に「今日の記事作って」と頼んで追加していく想定です。</p>
      </div>
    `;
    return;
  }

  latestRoot.innerHTML = `
    <article class="latest-box">
      <h3><a href="${article.articleUrl}">${article.title}</a></h3>
      <div class="article-meta">
        <span>${article.publishedAt}</span>
        <span>${article.repoName}</span>
      </div>
      <p>${article.summary}</p>
      <a class="link-button" href="${article.articleUrl}">記事を読む</a>
    </article>
  `;
}

function renderArchive(articles) {
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
