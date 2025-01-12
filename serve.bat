@echo off
SET ip_address=localhost
SET port=!
SET home_page=/index.html
SET not_found=!

cd ./build
"../bin/LocalWebServer.exe" %ip_address% %port% %home_page% %not_found%