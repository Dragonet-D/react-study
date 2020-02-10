const proxy = require('http-proxy-middleware');

module.exports = function proxyF(app) {
  app.use(
    proxy('/api', {
      target: 'https://172.16.38.123:31801',
      ws: true,
      secure: false,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
  // target: 'https://10.20.0.131:3801',
  // app.use(
  //   proxy('/api', {
  //     target: 'https://172.29.21.1:30800',
  //     ws: true,
  //     secure: false,
  //     pathRewrite: {
  //       '^/api': ''
  //     }
  //   })
  // );
  app.use(
    proxy('/downloadApi', {
      target: 'https://172.16.38.123:32100',
      ws: true,
      secure: false,
      pathRewrite: {
        '^/downloadApi': '/downloadApi'
      }
    })
  );
  app.use(
    proxy('/vms/fts/v1', {
      target: 'http://172.16.33.15:80/vms/fts/v1',
      ws: true,
      secure: false,
      pathRewrite: {
        '^/vms/fts/v1': '/vms/fts/v1'
      }
    })
  );

  app.use(
    proxy('/mapapi', {
      target: 'https://arcgisproxy.ivh.local',
      ws: true,
      secure: false,
      pathRewrite: {
        '^/mapapi': ''
      }
    })
  );

  app.use(
    proxy('/library/js/4.11', {
      target: 'https://172.16.32.33',
      ws: true,
      secure: false,
      pathRewrite: {
        '^/library/js/4.11': '/library/js/4.11'
      }
    })
  );

  app.use(
    proxy('/library/css/4.11', {
      target: 'https://172.16.32.33',
      ws: true,
      secure: false,
      pathRewrite: {
        '^/library/css/4.11': '/library/css/4.11'
      }
    })
  );

  app.use(
    proxy('/library', {
      target: 'https://172.16.32.33',
      ws: true,
      secure: false,
      pathRewrite: {
        '^/library': '/library'
      }
    })
  );

  app.use(
    proxy('/vadeWebSocketApi', {
      target: 'http://10.10.0.132:8715',
      ws: true,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/vadeWebSocketApi': '/'
      }
    })
  );

  app.use(
    proxy('/socketcommon', {
      target: 'http://172.16.38.123:31913',
      ws: true,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/socketcommon': ''
      }
    })
  );
};
