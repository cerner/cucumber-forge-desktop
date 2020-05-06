#!/bin/sh
git checkout ${TRAVIS_BRANCH}

if [ $(git tag --points-at HEAD) ]
then
  echo Regenerating documentation:

  node ./.travis/regenerateDocsReport.js

  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
  git config --global push.default current
  git commit ./docs/index.html -m "chore(docs): Regenerate docs"
  git push https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git
else
  echo Skipping doc regeneration since no new tag was created.
fi