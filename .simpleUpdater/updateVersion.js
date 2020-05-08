#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const packageJsonPath = '../package.json';
const packageJson = require(packageJsonPath);

const FILE_ENCODING = 'utf-8';

const currentVersion = packageJson.version;
const versionToSet = process.argv[2];
packageJson.version = versionToSet;

fs.writeFileSync(path.resolve(__dirname, packageJsonPath), JSON.stringify(packageJson, null, 2), FILE_ENCODING);

console.log(currentVersion);