@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [1/4] GitHubの最新版を取得しています...
git pull --ff-only
if errorlevel 1 goto error
echo [2/4] 必要なパッケージを確認しています...
call npm install --no-audit --no-fund
if errorlevel 1 goto error
echo [3/4] 本番用にビルドしています...
call npm run build
if errorlevel 1 goto error
echo [4/4] ローカル確認画面を開きます...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":4321" ^| findstr "LISTENING"') do taskkill /PID %%P /F >nul 2>&1
start "多磨霊園 ローカルプレビュー" cmd /k "cd /d \"%~dp0\" && npm run preview -- --host 127.0.0.1 --port 4321"
timeout /t 2 /nobreak >nul
start "" "http://localhost:4321/"
exit /b 0

:error
echo.
echo エラーが発生しました。
echo この画面をスクリーンショットしてChatGPTに送ってください。
pause
