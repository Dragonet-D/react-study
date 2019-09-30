const proxy = require('http-proxy-middleware');

module.export = app => {
  app.use(
    proxy('/api', {
      target: 'http:localhost:8080'
    })
  )
};
