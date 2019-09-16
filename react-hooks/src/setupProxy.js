const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', { target: 'https://www.wjx.cn/joinnew/processjq.ashx?curid=44255773&starttime=2019%2F8%2F18%209%3A45%3A00&source=directphone&submittype=1&ktimes=201&hlv=1&rn=3055902181.91631701&jpm=13&t=1566092744617&jqnonce=491b3d0a-c07a-408b-947c-3085e8572272&jqsign=580c2e1%60%2Cb16%60%2C519c%2C856b%2C2194d9463363' }));
};