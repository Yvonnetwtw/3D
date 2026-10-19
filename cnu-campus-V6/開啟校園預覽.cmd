@echo off
setlocal
cd /d "%~dp0"
set "CNU_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%CNU_NODE%" goto run
where node >nul 2>nul
if errorlevel 1 goto missing
set "CNU_NODE=node"
:run
echo Open http://127.0.0.1:49321/ in your browser after the server starts.
"%CNU_NODE%" "%~dp0preview.mjs"
pause
exit /b
:missing
echo Node.js is required. No software was installed or downloaded.
pause
