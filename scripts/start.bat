@echo off
echo Starting Shopping Cart Application...
docker-compose up -d
echo.
echo Application started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8080
echo Database: localhost:5432
echo Redis: localhost:6379
echo.
echo Press any key to continue...
pause
