import json
import os
import re

base_dir = r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base"
template_path = os.path.join(base_dir, "templates", "github-daily.template.html")
articles_json_path = os.path.join(base_dir, "data", "articles.json")

# Metadata
serial = 791
published_at = "2026-06-23"
created_at = "2026-06-23T19:25:00+09:00"
repo_slug = "finplot"
owner_repo = "highfestiva/finplot"
repo_url = "https://github.com/highfestiva/finplot"
star_count = 1157
star_count_comma = "1,157"
genre = "金融・トレード分析"
rank_or_pickup = "Pickup"
article_filename = "2026-06-23-finplot.html"
article_path = os.path.join(base_dir, "articles", "github", "daily", article_filename)
article_relative_url = f"./articles/github/daily/{article_filename}"

dek_description = "数十万のデータポイントを快適に描画できる、PyQtGraphベースの高速・高性能なPython用金融チャートプロットライブラリ"

what_is_this = (
    "<code>finplot</code>（Finance Plotter）は、バックテストや金融データの可視化に特化した、Python向けの超高速かつシンプルなプロットライブラリです。 "
    "有名な可視化ライブラリである <code>mpl_finance</code> や <code>plotly</code>、<code>Bokeh</code> などと比較して圧倒的に高いパフォーマンスを誇り、"
    "数十万件ものデータポイント（ローソク足など）を処理しても遅延なく動作します。<code>pyqtgraph</code> をベースにしており、"
    "デスクトップ環境での高速なズームやスクロール（パン）といったインタラクティブな操作を快適に行うことができます。"
)

what_can_it_do = (
    "株や暗号資産（仮想通貨）など、さまざまな金融データの時系列チャートを任意の時間枠（解像度）でプロットできます。 "
    "ローソク足チャートの描画をはじめ、インジケーター（MACD、RSI、ボリンジャーバンドなど）の重ね合わせ、出来高プロファイル（Volume Profile）、 "
    "ヒートマップ、注文板（オーダーブック）のリアルタイム更新表示などが可能です。 "
    "複数のチャートを同一の時間軸で同期させ、同時にズームイン・ズームアウトやスクロールを行うことも容易です。"
)

key_features = (
    "最も目立つのは、徹底的なパフォーマンス設計と、『気が利いたデフォルト設定（Opinionated）』です。 "
    "多くの一般的なグラフ描画ライブラリが金融特有のスクロールや縦方向の自動ズームで苦戦するなか、<code>finplot</code> は特別な設定なしで最適化された状態で機能します。 "
    "また、前回実行時に見ていたチャートの位置（拡大・縮小状態）を自動的に記憶して次回起動時に復元する『自動リロード機能』など、 "
    "バックテスト作業の効率を高める細かな配慮が施されています。"
)

setup_usage = (
    "pipを使って簡単にインストールできます：<br>"
    "<code>pip install finplot</code><br><br>"
    "使用例として、<code>yfinance</code> などで株価データをダウンロードし、ローソク足を描画するコードは数行で完結します：<br>"
    "<pre><code class=\"language-python\">import finplot as fplt\nimport yfinance\n\ndf = yfinance.download('AAPL')\nfplt.candlestick_ochl(df[['Open', 'Close', 'High', 'Low']])\nfplt.show()</code></pre><br>"
    "このコードを実行するだけで、インタラクティブに操作可能なAAPLの日足チャートが表示されます。 "
    "より複雑なレイアウトやインジケーターの追加方法は、公式リポジトリの <code>examples</code> ディレクトリや Wiki に豊富に掲載されています。"
)

target_audience = (
    "Pythonで自動取引システムの構築やバックテストを行っている開発者やトレーダーに最適です。 "
    "特に、大量のヒストリカルデータをミリ秒単位の描画遅延なくスムーズに分析したい人、 "
    "TradingViewのような使い心地のチャートをローカルのデスクトップ環境で手軽に構築したいデータサイエンティストに向いています。"
)

cautions = (
    "<code>finplot</code> はデスクトップアプリ（Qt）としての動作を前提としており、Webアプリケーションではありません。 "
    "そのため、Jupyter Lab/Notebook の中でインラインでインタラクティブに動かすことはできず、ブラウザベースのダッシュボードに組み込むことも基本的には困難です（ローカルのウィンドウとして起動します）。 "
    "また、ドキュメントの多くは体系的な API リファレンスというよりも、豊富なサンプルコード（examples）の形で提供されているため、 "
    "詳細なカスタマイズを行う際はソースコードやサンプルを読み解く必要があります。"
)

summary = (
    "<code>finplot</code> は、Pythonで金融データを扱う人々にとって、最もストレスなく動作する超高速プロットツールの一つです。 "
    "Webでの共有には不向きですが、ローカルでバックテストを回し、その結果を詳細かつスムーズに視覚化・検証したいというニーズには、これ以上ない強力な選択肢と言えます。"
)

# 1. Load template
with open(template_path, 'r', encoding='utf-8') as f:
    template_content = f.read()

# Replace placeholders
html_content = template_content
html_content = html_content.replace("{{REPO_SLUG}}", repo_slug)
html_content = html_content.replace("{{DEK_DESCRIPTION}}", dek_description)
html_content = html_content.replace("{{YYYY_MM_DD}}", published_at)
html_content = html_content.replace("{{RANK_OR_PICKUP}}", rank_or_pickup)
html_content = html_content.replace("{{REPO_URL}}", repo_url)
html_content = html_content.replace("{{OWNER_REPO}}", owner_repo)
html_content = html_content.replace("{{STAR_COUNT_COMMA}}", star_count_comma)
html_content = html_content.replace("{{WHAT_IS_THIS}}", what_is_this)
html_content = html_content.replace("{{WHAT_CAN_IT_DO}}", what_can_it_do)
html_content = html_content.replace("{{KEY_FEATURES}}", key_features)
html_content = html_content.replace("{{SETUP_USAGE}}", setup_usage)
html_content = html_content.replace("{{TARGET_AUDIENCE}}", target_audience)
html_content = html_content.replace("{{CAUTIONS}}", cautions)
html_content = html_content.replace("{{SUMMARY}}", summary)
html_content = html_content.replace("{{SERIAL_NUMBER}}", str(serial))

# Save article HTML (UTF-8 without BOM)
os.makedirs(os.path.dirname(article_path), exist_ok=True)
with open(article_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(html_content)
print(f"Created article: {article_path}")

# 2. Update articles.json
with open(articles_json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_entry = {
    "category": "github-pickup",
    "serial": serial,
    "originType": "pickup",
    "genre": genre,
    "repoName": owner_repo,
    "repoUrl": repo_url,
    "title": repo_slug,
    "dek": dek_description,
    "publishedAt": published_at,
    "createdAt": created_at,
    "starCount": star_count,
    "articleUrl": article_relative_url
}

# 配列の末尾に追加する
data["articles"].append(new_entry)

with open(articles_json_path, 'w', encoding='utf-8', newline='\n') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("Updated articles.json")
