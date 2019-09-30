const proxy = require('http-proxy-middleware');

modules.export = app => {
  app.use(
    proxy('/api', {
      target: 'http:localhost:8080'
    })
  )
};
