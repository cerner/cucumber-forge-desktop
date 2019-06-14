const { setWorldConstructor } = require('cucumber');

class CustomWorld {
  constructor() {
    this.featureFiles = [];
    this.addedDirectories = [];
    this.reportFiles = [];
    this.output = null;
    this.outputHTML = null;
    this.tag = null;

    this.win = null;
    this.doc = null;
    this.browser = null;
  }
}

setWorldConstructor(CustomWorld);
