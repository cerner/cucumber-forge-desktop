/* globals document */
const fs = require('fs');
const path = require('path');
const Generator = require('cucumber-forge-report-generator');
const { remote } = require('electron');
const underscore = require('underscore');
const underscorestring = require('underscore.string');

const fileEncoding = 'utf-8';
const generator = new Generator();

let selectedFolderPath;
let projectName;
let reportHTML;
let tag;

const getFeatureFiles = (directoryName) => {
  // Recurse on directories:
  const isDirectory = source => fs.lstatSync(source).isDirectory();
  const getDirectories = source => fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);
  const subDirectories = getDirectories(directoryName);
  const featureFiles = [];
  subDirectories.forEach(subDirectory => featureFiles.push(...getFeatureFiles(subDirectory)));

  // Add feature files from this directory.
  const allFiles = fs.readdirSync(directoryName);
  const localFeatureFiles = underscore.filter(allFiles, item => underscorestring.endsWith(item, '.feature'));
  localFeatureFiles.forEach(featureFileName => featureFiles.push(`${directoryName}/${featureFileName}`));
  return featureFiles;
};

const createReport = () => {
  tag = document.getElementById('tagBox').value;
  const featureFiles = getFeatureFiles(selectedFolderPath);
  generator.generate(featureFiles, projectName, tag).then((result) => {
    reportHTML = result;
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = reportHTML;
    outputElement.style.display = 'block';
    init(); // eslint-disable-line no-undef
    document.getElementById('appBody').classList.remove('empty');
  });
};

const getDefaultOutputFileName = () => {
  let reportName = `${projectName}.html`;
  if (tag) {
    reportName = `${tag}_${reportName}`;
  }
  return reportName;
};

const writeReportHTMLToFile = (fileName) => {
  if (fileName === undefined) return;
  fs.writeFileSync(fileName, reportHTML, fileEncoding);
};

/* eslint-disable no-unused-vars */
const saveOutput = () => {
  const defPath = getDefaultOutputFileName();
  remote.dialog.showSaveDialog({
    title: 'Save Report',
    defaultPath: defPath,
  }, writeReportHTMLToFile);
};

const setNewFolderPath = (folderPath) => {
  selectedFolderPath = folderPath;
  projectName = path.parse(selectedFolderPath).base;
  createReport();
};

const submitTagFiltersFromTextBox = (event) => {
  if (event.keyCode === 13) {
    createReport();
    return false;
  }
  return true;
};
