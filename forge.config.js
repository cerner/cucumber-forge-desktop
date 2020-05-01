const fs = require('fs');
const path = require('path');

const renameExecutable = (makeResult) => {
  const artifactNameBase = `cucumber-forge-desktop-${makeResult.platform}-${makeResult.arch}-${makeResult.packageJSON.version}-Setup`;
  const append = makeResult.platform === 'win32' ? '.exe' : '.dmg';
  const currFile = makeResult.artifacts.filter((artifact) => artifact.endsWith(append))[0];
  const newFile = `${path.parse(currFile).dir}/${artifactNameBase}${append}`;
  // eslint-disable-next-line no-param-reassign
  makeResult.artifacts[makeResult.artifacts.indexOf(currFile)] = newFile;
  return fs.renameSync(currFile, newFile);
};

module.exports = {
  packagerConfig: {
    icon: './src/resources/icons/logo',
    executableName: 'cucumber-forge',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        title: 'Cucumber Forge',
        name: 'cucumber_forge_desktop',
        exe: 'cucumber-forge.exe',
        setupIcon: './src/resources/icons/logo.ico',
        loadingGif: './src/resources/loading.gif',
        iconUrl: 'https://raw.githubusercontent.com/cerner/cucumber-forge-desktop/master/src/resources/icons/logo.ico',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'Cucumber Forge',
        icon: './src/resources/icons/logo.icns',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'linux',
      ],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'cerner',
          name: 'cucumber-forge-desktop',
        },
        draft: true,
      },
    },
  ],
  hooks: {
    postMake: async (forgeConfig, makeResults) => {
      // Rename the windows and OSX executables for consistency
      await makeResults.filter((result) => ['win32', 'darwin'].includes(result.platform))
        .forEach(renameExecutable);
      return makeResults;
    },
  },
};
