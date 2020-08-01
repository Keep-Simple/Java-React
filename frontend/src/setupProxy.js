const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(createProxyMiddleware('/ws', {
    target: 'http://backend:8080',
    ws: true
  }));
};
