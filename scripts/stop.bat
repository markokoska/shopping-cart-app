"
@echo off
echo Stopping Shopping Cart Application...
docker-compose down
echo Application stopped!
pause
"@ | Out-File -FilePath "scripts\stop.bat" -Encoding UTF8