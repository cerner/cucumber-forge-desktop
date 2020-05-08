#!/bin/sh

original_version=$(node ./.simpleUpdater/updateVersion.js 0.0.1)

npm install
npm run make
node ./.simpleUpdater/updateVersion.js $original_version

sed -i -e '$a\' package.json
npm install

./out/make/squirrel.windows/x64/cucumber-forge-desktop-win32-x64-0.0.1-Setup.exe

echo "
To validate that the auto-update functionality works, the current Cucumber Forge code
has been packaged with an old version and installed. Restart the application to 
trigger the automatic check for updates. Make sure that the updator properly downloads 
and installs the latest version."
