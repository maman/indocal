require('babel-register');
const createWebpackConfig = require('../src/createWebpackConfig');
module.exports = createWebpackConfig(true, true);
