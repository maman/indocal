if (process.env.NODE_ENV !== 'production') {
  require('babel-register');
  require('./src');
} else {
  require('./dist');
}
