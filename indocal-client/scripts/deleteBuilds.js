const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const target = path.resolve(__dirname, '../dist');
let files;

try {
  files = fs.readdirSync(target);
} catch (e) {
  throw new Error('Build directory not found');
}
if (files.length > 0) {
  files.forEach(file => {
    if (!file.includes('.gitignore')) {
      const filePath = `${target}/${file}`;
      rimraf.sync(filePath);
    }
  });
}
