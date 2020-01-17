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

const isDirectory = (source) => fs.lstatSync(source).isDirectory();

const getFeatureFiles = (directoryName) => {
  // Recurse on directories:
  const getDirectories = (source) => fs
    .readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isDirectory);
  const subDirectories = getDirectories(directoryName);
  const featureFiles = [];
  subDirectories.forEach((subDirectory) => featureFiles.push(...getFeatureFiles(subDirectory)));

  // Add feature files from this directory.
  const allFiles = fs.readdirSync(directoryName);
  const localFeatureFiles = underscore.filter(allFiles, (item) => underscorestring.endsWith(item, '.feature'));
  localFeatureFiles.forEach((featureFileName) => featureFiles.push(`${directoryName}/${featureFileName}`));
  return featureFiles;
};

const toggleLoadingInd = () => {
  const loadingElem = document.getElementById('loadingInd');
  const outputElement = document.getElementById('output');
  if (loadingElem.style.display === 'block') {
    loadingElem.style.display = 'none';
    outputElement.style.display = 'block';
    document.getElementById('appBody').classList.remove('empty');
  } else {
    loadingElem.style.display = 'block';
    outputElement.style.display = 'none';
    document.getElementById('appBody').classList.add('empty');
  }
};

const createReport = () => {
  const startTime = Date.now();
  toggleLoadingInd();

  tag = document.getElementById('tagBox').value;
  const featureFiles = getFeatureFiles(selectedFolderPath);
  generator.generate(featureFiles, projectName, tag).then((result) => {
    reportHTML = result;
    // Display the loading indicator for at least 0.5 sec
    const timeout = 500 - (Date.now() - startTime);
    setTimeout(toggleLoadingInd, timeout);
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = reportHTML;
    outputElement.style.display = 'block';
    init(); // eslint-disable-line no-undef
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
  selectedFolderPath = isDirectory(folderPath) ? folderPath : path.dirname(folderPath);
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
