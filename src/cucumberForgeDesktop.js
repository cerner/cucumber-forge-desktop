/* globals document */
const fs = require('fs');
const path = require('path');
const Generator = require('cucumber-forge-report-generator');
const { remote } = require('electron');

const fileEncoding = 'utf-8';
const generator = new Generator();

let selectedFolderPath;
let projectName;
let reportHTML;
let tag;

const isDirectory = (source) => fs.lstatSync(source).isDirectory();

const toggleLoadingInd = () => {
  const loadingElem = document.getElementById('loadingInd');
  const outputElement = document.getElementById('output');
  if (loadingElem.style.display === 'block') {
    loadingElem.style.display = 'none';
    outputElement.style.display = 'block';
    if (reportHTML) {
      document.getElementById('appBody').classList.remove('empty');
    }
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
  try {
    reportHTML = generator.generate(selectedFolderPath, projectName, tag);
  } catch (error) {
    reportHTML = '';
    remote.dialog.showErrorBox('Error Generating Report', error.message);
  }
  // Display the loading indicator for at least 0.5 sec
  const timeout = 500 - (Date.now() - startTime);
  setTimeout(toggleLoadingInd, timeout);
  document.getElementById('output').innerHTML = reportHTML;
  init(); // eslint-disable-line no-undef
};

const getDefaultOutputFileName = () => {
  let reportName = `${projectName}.html`;
  if (tag) {
    reportName = `${tag}_${reportName}`;
  }
  return reportName;
};

const writeReportHTMLToFile = (fileName) => {
  if (fileName === undefined) {
    return;
  }
  fs.writeFileSync(fileName, reportHTML, fileEncoding);
};

/* eslint-disable no-unused-vars */
const saveOutput = () => {
  const defPath = getDefaultOutputFileName();
  remote.dialog.showSaveDialog({
    title: 'Save Report',
    defaultPath: defPath,
  }).then((result) => writeReportHTMLToFile(result.filePath));
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
