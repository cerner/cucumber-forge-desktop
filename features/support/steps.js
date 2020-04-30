const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const electronPath = require('electron');
const fs = require('fs');
const path = require('path');
const spectron = require('spectron');
const Timeout = require('await-timeout');

const {
  Given, When, Then, After, Before,
} = require('cucumber');
const { expect } = require('chai');

const FILE_ENCODING = 'utf-8';

chai.should();
chai.use(chaiAsPromised);

const createDirectory = (directoryName) => {
  const dirPath = path.resolve(__dirname, directoryName);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  return dirPath;
};

async function startApp(world) {
  let timeout = 7400;
  let tryCount = 1;
  while (tryCount <= 4) {
    // eslint-disable-next-line no-param-reassign
    world.app = new spectron.Application({
      path: electronPath,
      args: [path.join(__dirname, '../../src/main.js')],
      chromeDriverArgs: ['no-sandbox', 'disable-dev-shm-usage'],
      startTimeout: 118 * 1000,
      waitTimeout: 10 * 1000,
    });
    // eslint-disable-next-line no-await-in-loop
    await Timeout.wrap(world.app.start(), timeout);
    if (world.app.isRunning()) {
      return;
    }
    timeout *= 2;
    tryCount += 1;
  }
  throw new Error('Could not start app after 4 tries.');
}

Before({ timeout: 119 * 1000 }, function () {
  return startApp(this);
});

Before(function () {
  chaiAsPromised.transferPromiseness = this.app.transferPromiseness;
  // Create directories.
  this.addedDirectories.unshift(createDirectory('./pets'));
  this.addedDirectories.unshift(createDirectory('./pets/felines'));
});

Given('there is a file named {string} with the following contents:', function (fileName, contents) {
  const filePath = path.resolve(__dirname, fileName);
  this.featureFiles.push(filePath);
  fs.writeFileSync(filePath, contents, FILE_ENCODING);
});

When('the user selects the {string} directory with the folder selection button', function (directoryName) {
  const dirPath = path.resolve(__dirname, directoryName);
  return this.app.client.execute((newPath) => {
    // eslint-disable-next-line no-undef
    createReportForFolder(newPath);
  }, dirPath);
});

When('the user enters the value {string} into the filter text box', function (tag) {
  return this.app.client.addValue('#tagBox', tag);

  // return this.app.client.waitUntilWindowLoaded().$('#tagBox').setValue(tag);

  // this.app.client.execute((tagValue) => {
  //   // eslint-disable-next-line no-undef
  //   document.getElementById('tagBox').value = tagValue;
  // }, tag);

  // return this.app.client.getText('#tagBox').then((reportText) => {
  //   expect(reportText).to.eql(tag);
  // });
});

When('the user clicks the filter button', function () {
  return this.app.client.waitUntilWindowLoaded().click('#tagButton');
});

When('the user presses enter', function () {
  return this.app.client.addValue('#tagBox', '\n');
});

When('the user clicks the save button', function () {
  return this.app.client.execute(() => {
    // eslint-disable-next-line no-undef
    writeReportHTMLToFile(getDefaultOutputFileName());
  });
});

Then(/the report (?:will be|is) displayed/, { timeout: 60 * 1000 }, function () {
  // Wait for a second for the loading ind to disappear
  return this.app.client.waitUntilWindowLoaded().getText('#output')
    .should.eventually.not.equal('');
});

Then('the report will be saved in a file called {string}', function (fileName) {
  expect(fs.existsSync(fileName)).to.eql(true);
  this.reportFiles.push(fileName);
});

Then(/^the report name on the sidebar (?:is|will be) '(.+)'$/, function (reportTitle) {
  return this.app.client.getText('#sidenavTitle').then((reportText) => {
    expect(reportText).to.eql(reportTitle);
  });
});

Then(/^the project title on the sidebar (?:is|will be) '(\w+)'$/, function (projectTitle) {
  return this.app.client.getText('#headerTitle').then((reportText) => {
    expect(reportText).to.eql(projectTitle);
  });
});

Then(/^the report will contain (\d+) features?$/, function (featureCount) {
  return this.app.client.$$('.feature-wrapper').then((features) => {
    expect(features.length).to.eql(featureCount);
  });
});

Then(/^the report (?:will contain|contains) (\d+) scenarios?$/, function (scenarioCount) {
  return this.app.client.$$('.feature-wrapper').then((features) => this.app.client.$$('.scenario-divider').then((scenarios) => {
    expect(scenarios.length).to.eql(scenarioCount - features.length);
  }));
});

After({ timeout: 119 * 1000 }, function () {
  // Clean up any files that got written.
  this.reportFiles.forEach((filePath) => fs.unlinkSync(filePath));
  this.featureFiles.forEach((filePath) => fs.unlinkSync(filePath));
  this.addedDirectories.forEach((dirPath) => fs.rmdirSync(dirPath));

  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
  return null;
});
