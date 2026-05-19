@echo off
echo ==============================================
echo   ArSign - Starting Frontend and Backend
echo ==============================================

echo [1/2] Starting Backend Server (FastAPI)...
start "ArSign Backend" cmd /k "uvicorn backend.main:app --reload"

echo [2/2] Starting Frontend Server (Angular)...
cd frontend\ars-sign
start "ArSign Frontend" cmd /k "ng serve"

echo Done! Both servers are starting up in separate windows.
