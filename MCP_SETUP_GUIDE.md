# AI ツール MCP 一括導入チートシート

各 AI ツールに MCP サーバーを導入する際の標準的なコマンド・手順まとめです。

## 1. Claude Code
設定ファイルを直接編集するのが確実です。
- **パス**: `~/.claude.json`
- **書き換え箇所**: `"mcpServers": { ... }` 内に以下のような構造で追加。
```json
"server-name": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@org/package-name"],
  "env": { "KEY": "VALUE" }
}
```

## 2. Codex
グローバル設定にコマンドで追加します。
- **コマンド**: `codex mcp add <name> <command> <args...>`
- **例**: `codex mcp add github --env TOKEN=xxx npx -y @modelcontextprotocol/server-github`

## 3. Gemini CLI
ユーザー設定（-s user）に環境変数（-e）を付けて追加します。
- **コマンド**: `gemini mcp add <name> <command> -s user -e KEY=VAL -- <args...>`
- **注意**: 引数の衝突を避けるため `--` を使用すること。

## 4. GitHub Copilot CLI
内部の copilot コマンドに `--` を二重に使って引数を渡します。
- **コマンド**: `gh copilot -- mcp add <name> -- <command> <args...>`
- **例**: `gh copilot -- mcp add playwright -- npx -y @playwright/mcp`

## 5. Antigravity (私)
- システム環境変数や `.env` を参照し、必要に応じて `npx` 等で直接実行して連携。
- 共有メモリ（memory-server）を介して他ツールと情報を同期。

---
作成日: 2026-04-29
対象サーバー: github, playwright, memory, sequential-thinking, fetch
