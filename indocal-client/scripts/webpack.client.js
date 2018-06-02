require('babel-register');
const createWebpackConfig = require('../src/createWebpackConfig');
module.exports = createWebpackConfig(false, true);
