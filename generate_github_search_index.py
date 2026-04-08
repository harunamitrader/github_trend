from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ARTICLES_JSON = ROOT / "data" / "articles.json"
OUTPUT_JSON = ROOT / "data" / "github-search-index.json"
GITHUB_CATEGORIES = {"github-trending", "github-pickup", "github-update-report"}


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._skip_depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in {"script", "style"}:
            self._skip_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style"} and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._skip_depth == 0:
            self.parts.append(data)


def normalize_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def extract_html_text(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html)
    return normalize_text(" ".join(parser.parts))


def main() -> None:
    payload = json.loads(ARTICLES_JSON.read_text(encoding="utf-8"))
    index_items = []

    for article in payload.get("articles", []):
        category = (article.get("category") or "").strip()
        if category not in GITHUB_CATEGORIES:
            continue

        article_url = article.get("articleUrl") or ""
        article_path = ROOT / article_url.removeprefix("./")
        article_text = ""
        if article_path.exists():
            article_text = extract_html_text(article_path.read_text(encoding="utf-8"))

        search_parts = [
            article.get("title", ""),
            article.get("dek", ""),
            article.get("summary", ""),
            article.get("repoName", ""),
            article.get("genre", ""),
            article_text,
        ]
        search_text = normalize_text(" ".join(part for part in search_parts if part))

        index_items.append(
            {
                "slug": article.get("slug"),
                "category": category,
                "originType": article.get("originType", ""),
                "title": article.get("title", ""),
                "dek": article.get("dek", ""),
                "summary": article.get("summary", ""),
                "repoName": article.get("repoName", ""),
                "genre": article.get("genre", ""),
                "publishedAt": article.get("publishedAt", ""),
                "createdAt": article.get("createdAt", ""),
                "articleUrl": article_url,
                "serial": article.get("serial"),
                "searchText": search_text,
            }
        )

    index_items.sort(
        key=lambda item: (
            item.get("publishedAt", ""),
            item.get("createdAt", ""),
            str(item.get("slug", "")),
        ),
        reverse=True,
    )

    OUTPUT_JSON.write_text(
        json.dumps(
            {
                "generatedAt": __import__("datetime").datetime.now(
                    __import__("datetime").timezone.utc
                ).isoformat(),
                "count": len(index_items),
                "articles": index_items,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {len(index_items)} entries to {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
