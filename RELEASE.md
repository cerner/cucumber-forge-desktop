# How to Release

Releasing the project requires these steps:

0. Upgrade dependency versions as necessary. (See: `npm audit`)
0. Run `npm version *major|minor|patch*` (this project uses [semantic versioning](http://semver.org/))
0. Push new commit to master and push the newly created tag (this will trigger a Travis build)
0. Wait for the Travis build to complete
0. Add changelog information to the GitHub release (include relevant changes from cucumber-forge-report-generator)
0. Update the versions in the `updates.json` file to reflect the new release version (this will trigger the clients to auto-update)

## GitHub Release Template
```.md
Tag Version: vX.X.X
Release Title: vX.X.X

## [X.X.X](https://github.com/cerner/cucumber-forge-desktop/compare/vX.X.W...vX.X.X) (YEAR-MO-DAY)


### Bug Fixes
* **app:** Commit message ([#issue](https://github.com/cerner/cucumber-forge-desktop/issues/#issue)) ([commit-hash](https://github.com/cerner/cucumber-forge-desktop/commit/commit-hash))

### Features
* **report:** Commit message ([#issue](https://github.com/cerner/cucumber-forge-report-generator/issues/#issue)) ([commit-hash](https://github.com/cerner/cucumber-forge-report-generator/commit/commit-hash))

### BREAKING CHANGES
* **app:** Commit message ([#issue](https://github.com/cerner/cucumber-forge-desktop/issues/#issue)) ([commit-hash](https://github.com/cerner/cucumber-forge-desktop/commit/commit-hash))
```
