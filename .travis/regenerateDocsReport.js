#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Generator = require('../node_modules/cucumber-forge-report-generator/src/Generator');

const FILE_ENCODING = 'utf-8';

const getFeatureFiles = (directoryName) => {
  if (directoryName.endsWith('node_modules')) {
    return [];
  }

  // Recurse on directories:
  const isDirectory = (source) => fs.lstatSync(source).isDirectory();
  const getDirectories = (source) => fs
    .readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isDirectory);
  const subDirectories = getDirectories(directoryName);
  const featureFiles = [];
  subDirectories.forEach((subDirectory) => featureFiles.push(...getFeatureFiles(subDirectory)));

  // Add feature files from this directory.
  const allFiles = fs.readdirSync(directoryName);
  const localFeatureFiles = allFiles.filter((item) => item.endsWith('.feature'));
  localFeatureFiles.forEach((featureFileName) => featureFiles.push(`${directoryName}/${featureFileName}`));
  return featureFiles;
};

const featureFiles = getFeatureFiles(path.resolve(__dirname, '../'));
new Generator().generate(featureFiles, 'cucumber-forge-desktop').then((result) => {
  fs.writeFileSync(path.resolve(__dirname, '../docs/index.html'), result, FILE_ENCODING);
});
