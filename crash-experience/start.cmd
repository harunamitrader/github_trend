@echo off
rem 暴落体験 — ローカルサーバー起動 (IndexedDBのため file:// ではなく http で開く)
cd /d %~dp0
start "" http://localhost:8317
where node >nul 2>nul
if %errorlevel%==0 (
  npx -y http-server -p 8317 -c-1 .
) else (
  python -m http.server 8317
)
