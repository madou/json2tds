import fs from 'fs-extra';
import path from 'path';
import guid from 'guid';

import generateItem from './lib/itemGenerator';
import parseTemplate from './lib/templateParser';
import parseItem from './lib/itemParser';

const argv = require('yargs')
  .string('dist')
  .string('src')
  .argv;

const {
  dist: destination,
  src: source,
} = argv;

function readAllFiles(src) {
  const sourcePath = path.resolve(src);

  const files = fs.readdirSync(sourcePath).sort();

  // eslint-disable-next-line
  return files.map(file => require(path.resolve(sourcePath, file)));
}

function generate() {
  fs.ensureDirSync(destination);

  const revision = guid.create();

  const parentPath = `${destination}.item`;
  const parent = parseItem(parentPath);

  if (!parent || Object.keys(parent).length === 0) {
    throw new Error(`Parent wasnt found at: ${parentPath}`);
  }

  const files = readAllFiles(source);
  files.forEach((file) => {
    const template = parseTemplate(file.templatePath);

    generateItem(file, template, parent, {
      destination,
      revision: revision.value,
      createdBy: 'sitecore\\json2tds',
    });
  });
}

generate();
