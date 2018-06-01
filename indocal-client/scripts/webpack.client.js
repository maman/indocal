require('babel-register');
const createWebpackConfig = require('./createWebpackConfig');
module.exports = createWebpackConfig(false, true);
