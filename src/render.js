/* globals document */
const fs = require('fs');
const path = require('path');
const { remote, ipcRenderer } = require('electron');

const fileEncoding = 'utf-8';

let selectedFolderPath;
let projectName;
let reportHTML;
let tag;

const toggleLoadingInd = () => {
  if (reportHTML) {
    document.getElementById('appBody').classList.remove('empty');
  } else {
    document.getElementById('appBody').classList.add('empty');
  }

  const waitingMask = document.getElementById('mask');
  if (!waitingMask.style.display || waitingMask.style.display === 'none') {
    waitingMask.style.display = 'block';
  } else {
    waitingMask.style.display = 'none';
  }
};

ipcRenderer.on('create-report-reply', (event, arg) => {
  reportHTML = arg;
  toggleLoadingInd();
  document.getElementById('output').innerHTML = reportHTML;
  init(); // eslint-disable-line no-undef
});
ipcRenderer.on('toggle-loading-ind', () => {
  toggleLoadingInd();
});

const createReport = () => {
  tag = document.getElementById('tagBox').value;
  const request = {
    folderPath: selectedFolderPath,
    projectName,
    tag,
  };
  toggleLoadingInd();
  ipcRenderer.send('create-report-request', request);
};

const createReportForFolder = (folderPath) => {
  selectedFolderPath = folderPath;
  projectName = path.parse(folderPath).base;
  createReport();
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
const clickSaveButton = () => {
  const defPath = getDefaultOutputFileName();
  remote.dialog.showSaveDialog({
    title: 'Save Report',
    defaultPath: defPath,
  }).then((result) => writeReportHTMLToFile(result.filePath));
};

const clickFolderSelectionButton = async () => {
  const selectedPaths = await remote.dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
  });
  const [filePath] = selectedPaths.filePaths;
  if (filePath) {
    createReportForFolder(filePath);
  }
};

const clickFilterButton = () => {
  createReport();
};

const submitTagFiltersFromTextBox = (event) => {
  if (event.keyCode === 13) {
    createReport();
    event.preventDefault();
  }
};
