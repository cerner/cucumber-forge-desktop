#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Generator = require('cucumber-forge-report-generator');

const FILE_ENCODING = 'utf-8';

const report = new Generator().generate(path.resolve(__dirname, '../../'), 'cucumber-forge-desktop')
fs.writeFileSync(path.resolve(__dirname, '../../docs/index.html'), report, FILE_ENCODING);
