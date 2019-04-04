// @ts-ignore
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api/music', {
      target: 'http://localhost:3001/',
      pathRewrite: {
        '^/api/music': '/'
      }
    })
  );
};
