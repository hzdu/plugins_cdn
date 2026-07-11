@echo off
cls

echo ========================================
echo        Git One-Click Sync Tool
echo ========================================
echo.

:: 1. Check if .git exists
if not exist .git (
    echo [ERROR] .git folder not found! 
    echo Please run this script in the project root.
    pause
    exit
)

:: 2. Show status
echo [1/4] Checking file changes...
git status -s
echo.

:: 3. Get input
set /p msg="Enter commit message (Default: Update): "
if "%msg%"=="" set msg=Update

echo.
echo [2/4] Staging files (git add)...
git add .

echo [3/4] Creating commit (git commit)...
git commit -m "%msg%"

echo [4/4] Pushing to GitHub (git push)...
git push origin main

echo.
echo ========================================
echo [SUCCESS] Your code is now on GitHub!
echo ========================================
echo.
pause
