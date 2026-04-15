# GitHub Watcher 投資・トレード研究向けリポジトリ抜粋資料

- 作成日: 2026-04-15
- 調査母集団: GitHub Watcher に蓄積された **223件のリポジトリ要約記事**
- 目的: 投資・トレードの **研究 / 検証 / 自動化 / 助言支援** に使えそうな repo を、実務導入の観点で絞り込む

## 1. 先に結論

まず優先して見る価値が高いのは、次の5本です。

| 優先 | repo | 主用途 | なぜ有力か |
| --- | --- | --- | --- |
| 1 | [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB) | データ取得・分析基盤 | 金融データ取得の土台になりやすく、他の分析や自動化フローに接続しやすい |
| 2 | [nautechsystems/nautilus_trader](https://github.com/nautechsystems/nautilus_trader) | 本格バックテスト・執行 | 研究コードとライブ運用の距離が近く、実装資産を使い回しやすい |
| 3 | [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | エージェント型市場分析 | センチメント・マクロ・議論型意思決定を一つの流れで試せる |
| 4 | [shiyu-coder/Kronos](https://github.com/shiyu-coder/Kronos) | 市場予測研究 | OHLCV 系列を foundation model 的に扱う研究基盤として面白い |
| 5 | [ai4finance-foundation/finrobot](https://github.com/ai4finance-foundation/finrobot) | リサーチ自動化・助言支援 | 調査・比較・評価・レポート化までを agent 的に繋げやすい |

## 2. 選定基準

以下のいずれかに明確に効く repo を優先しました。

1. 投資判断のためのデータ取得・市場分析
2. 戦略立案、仮説生成、助言支援
3. バックテスト、強化学習、ストラテジ検証
4. 自動売買・執行・チャート分析の自動化
5. 開発者が継続運用できる現実的な導入余地

## 3. 用途別ショートリスト

### A. データ取得・リサーチ自動化

#### 1. OpenBB
- Repo: [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB)
- GitHub Watcher 記事: [OpenBB 紹介記事](../articles/github/daily/2026-03-29-openbb.html)
- Star: 65,908
- 概要: クオンツやアナリスト向けのオープンソース金融データ連携プラットフォーム。
- どう役立ちそうか: 株価、ファンダメンタル、マクロ、代替データ取得の入口として強いです。独自戦略や社内分析パイプラインを作る際の「データ接続層」を自前でゼロから組まずに済みます。

#### 2. finrobot
- Repo: [ai4finance-foundation/finrobot](https://github.com/ai4finance-foundation/finrobot)
- GitHub Watcher 記事: [finrobot 紹介記事](../articles/github/daily/2026-04-04-ai4finance-foundation-finrobot-pickup.html)
- Star: 6,696
- 概要: financial data 取得、forecast、valuation、peer comparison、risk assessment、レポート生成までを multi-agent でつなぐ金融 AI プラットフォーム。
- どう役立ちそうか: 銘柄調査や定例レポート作成を半自動化しやすいです。投資判断の前段にある情報整理・比較・説明資料づくりを大きく短縮できます。

#### 3. dexter
- Repo: [virattt/dexter](https://github.com/virattt/dexter)
- GitHub Watcher 記事: [dexter 紹介記事](../articles/github/daily/2026-03-27-virattt-dexter.html)
- Star: 21,293
- 概要: 自ら考え、計画し、反省しながら金融リサーチを完遂する自律型金融アナリストエージェント。
- どう役立ちそうか: 人手で行っている「論点整理→追加調査→仮説更新」の流れをエージェント化する参考になります。投資助言の下調べや社内メモ生成にも応用しやすいです。

#### 4. finance-skills
- Repo: [himself65/finance-skills](https://github.com/himself65/finance-skills)
- GitHub Watcher 記事: [finance-skills 紹介記事](../articles/github/daily/2026-04-08-himself65-finance-skills-pickup.html)
- Star: 1,134
- 概要: 流動性解析や市場インパクト評価などを AI エージェントに教える金融特化スキル集。
- どう役立ちそうか: 「何を見て流動性を判断するか」を agent に埋め込む部品として有効です。助言支援や売買判断の説明責任を厚くしたいときに使いやすいです。

### B. 戦略生成・議論・助言支援

#### 5. ai-hedge-fund
- Repo: [virattt/ai-hedge-fund](https://github.com/virattt/ai-hedge-fund)
- GitHub Watcher 記事: [ai-hedge-fund 紹介記事](../articles/github/daily/2026-04-09-virattt-ai-hedge-fund.html)
- Star: 54,625
- 概要: 著名投資家の思考様式を模した複数エージェントが議論し、合意形成で投資判断を行うシステム。
- どう役立ちそうか: 単一モデル依存を避けた「多視点レビュー」に向いています。社内の投資会議を AI で先回りさせるような使い方に向いています。

#### 6. TradingAgents
- Repo: [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents)
- GitHub Watcher 記事: [TradingAgents 紹介記事](../articles/github/daily/2026-03-31-trading-agents.html)
- Star: 50,590
- 概要: LangGraph ベースでセンチメント、マクロ、テクニカルなどを分担分析するマルチエージェント投資分析基盤。
- どう役立ちそうか: 市場判断のプロセスを役割分担で分解したい時に有効です。分析観点を増やしつつ、判断手順を標準化するベースとして使えます。

#### 7. Vibe-Trading
- Repo: [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading)
- GitHub Watcher 記事: [Vibe-Trading 紹介記事](../articles/github/daily/2026-04-09-hkuds-vibe-trading.html)
- Star: 1,887
- 概要: 自然言語から戦略生成、バックテスト、クロスマーケット分析まで行う AI 金融ワークスペース。
- どう役立ちそうか: 非エンジニア寄りの運用担当でも「言葉で戦略を試す」入り口を作れます。アイデア検証の回転数を上げる用途に向いています。

#### 8. autotrade
- Repo: [rv64m/autotrade](https://github.com/rv64m/autotrade)
- GitHub Watcher 記事: [autotrade 紹介記事](../articles/github/daily/2026-04-07-rv64m-autotrade-pickup.html)
- Star: 143
- 概要: Claude / Gemini / Codex などを使い、戦略生成→バックテスト→改善を自律ループさせる検証フレームワーク。
- どう役立ちそうか: 「AI が自分で戦略を改善し続ける」流れを試したい場合の実験台になります。少額の研究環境や paper trading での継続改善検証に向きます。

### C. バックテスト・執行・戦略検証

#### 9. nautilus_trader
- Repo: [nautechsystems/nautilus_trader](https://github.com/nautechsystems/nautilus_trader)
- GitHub Watcher 記事: [nautilus_trader 紹介記事](../articles/github/daily/2026-04-15-nautechsystems-nautilus-trader-pickup.html)
- Star: 21,952
- 概要: Rust コア + Python 制御レイヤーで、バックテストからライブ取引までを同一アーキテクチャで扱える本番向けクォンツ基盤。
- どう役立ちそうか: 研究環境から本番執行までの移植コストを下げられます。実運用を視野に入れた戦略検証基盤として最も実務的です。

#### 10. TensorTrade
- Repo: [tensortrade-org/tensortrade](https://github.com/tensortrade-org/tensortrade)
- GitHub Watcher 記事: [TensorTrade 紹介記事](../articles/github/daily/2026-04-13-tensortrade-org-tensortrade.html)
- Star: 6,160
- 概要: RL を用いた自律型トレーディングエージェント構築のための Python フレームワーク。
- どう役立ちそうか: 報酬関数や市場環境の設計を変えながら、研究用途の強化学習トレーディングを試せます。アイデア探索の自由度が高いです。

#### 11. options_portfolio_backtester
- Repo: [lambdaclass/options_portfolio_backtester](https://github.com/lambdaclass/options_portfolio_backtester)
- GitHub Watcher 記事: [options_portfolio_backtester 紹介記事](../articles/github/daily/2026-03-31-options-portfolio-backtester.html)
- Star: 224
- 概要: オプションやテールリスクを含むポートフォリオ戦略を高速に検証する Rust 製バックテスター。
- どう役立ちそうか: デルタ中立、オプション売り、ヘッジ戦略のような「単純な株売買ではない」検証で効きます。デリバティブ寄りの研究には特に有用です。

#### 12. freqtrade-strategies
- Repo: [freqtrade/freqtrade-strategies](https://github.com/freqtrade/freqtrade-strategies)
- GitHub Watcher 記事: [freqtrade-strategies 紹介記事](../articles/github/daily/2026-04-11-freqtrade-freqtrade-strategies.html)
- Star: 5,037
- 概要: Freqtrade 用の戦略実装集。多くのテクニカル指標・売買ルールが具体コードで蓄積されています。
- どう役立ちそうか: 戦略の雛形集として非常に便利です。自作戦略の比較対象や、初期仮説を素早く作る材料として使えます。

### D. 予測・可視化・学習資産

#### 13. Kronos
- Repo: [shiyu-coder/Kronos](https://github.com/shiyu-coder/Kronos)
- GitHub Watcher 記事: [Kronos 紹介記事](../articles/github/daily/2026-04-11-shiyu-coder-kronos.html)
- Star: 18,038
- 概要: 金融市場の OHLCV 系列をトークン化して扱う foundation model。
- どう役立ちそうか: 価格系列予測や市場 regime 研究の出発点になります。従来の特徴量エンジニアリング中心のアプローチと比較したい場合に面白いです。

#### 14. tradingview-mcp
- Repo: [tradesdontlie/tradingview-mcp](https://github.com/tradesdontlie/tradingview-mcp)
- GitHub Watcher 記事: [tradingview-mcp 紹介記事](../articles/github/daily/2026-04-07-tradesdontlie-tradingview-mcp-pickup.html)
- Star: 1,810
- 概要: TradingView Desktop を AI エージェントから操作し、チャート分析や Pine Script 開発を自動化する MCP サーバー。
- どう役立ちそうか: チャート確認、スクリーンショット解析、Pine Script 試作を AI に任せやすくなります。裁量トレード支援と開発支援の間を埋めるツールです。

#### 15. awesome-systematic-trading
- Repo: [paperswithbacktest/awesome-systematic-trading](https://github.com/paperswithbacktest/awesome-systematic-trading)
- GitHub Watcher 記事: [awesome-systematic-trading 紹介記事](../articles/github/daily/2026-04-13-paperswithbacktest-awesome-systematic-trading.html)
- Star: 7,937
- 概要: システムトレーディングのライブラリ、戦略、書籍、論文を横断的に集めたリソース集。
- どう役立ちそうか: どのライブラリや論文から着手するべきかを探す時間を減らせます。チームの学習ロードマップを作る時にも便利です。

## 4. 用途別のおすすめ導入順

### すぐ分析基盤を作りたい
1. OpenBB
2. finrobot
3. finance-skills

### エージェント型の投資調査を試したい
1. TradingAgents
2. ai-hedge-fund
3. dexter
4. Vibe-Trading

### バックテストから執行まで繋げたい
1. nautilus_trader
2. freqtrade-strategies
3. options_portfolio_backtester

### 予測モデルや RL を研究したい
1. Kronos
2. TensorTrade
3. autotrade

### チャート分析と裁量支援を強化したい
1. tradingview-mcp
2. OpenBB
3. finance-skills

## 5. 実務導入の見方

この 15 本は、性格が大きく3種類に分かれます。

1. **基盤型**: OpenBB, nautilus_trader, TensorTrade  
   研究・実装の土台になりやすい repo。
2. **エージェント型**: TradingAgents, ai-hedge-fund, finrobot, dexter, Vibe-Trading, autotrade  
   分析や助言支援のワークフロー自動化に向く repo。
3. **補助・資産型**: freqtrade-strategies, tradingview-mcp, finance-skills, Kronos, awesome-systematic-trading, options_portfolio_backtester  
   既存フローの補強や専門論点の追加に向く repo。

実務観点では、まず **OpenBB + nautilus_trader + TradingAgents** の3本を起点に見るのが堅いです。  
ここで「データ取得」「戦略検証」「マルチエージェント分析」の土台が揃います。

## 6. 注意点

- 多くは **研究・開発向け OSS** であり、そのまま投資助言や本番自動売買に直結させるには追加検証が必要です。
- エージェント型 repo は出力の説得力が高く見えやすいため、**バックテスト・フォワードテスト・コンプライアンス確認** を必ず別で置くべきです。
- 助言用途に使う場合は、説明責任、ログ保存、根拠提示、法務確認の設計が重要です。

## 7. まとめ

GitHub Watcher 全体を見渡すと、投資向けで特に面白い流れは次の3つでした。

1. **金融分析のエージェント化**
2. **研究から執行までの一気通貫化**
3. **予測モデルと RL の再評価**

「まず何から触るか」で迷うなら、**OpenBB / nautilus_trader / TradingAgents / finrobot / Kronos** の5本から始めるのが最も再利用性が高いです。
