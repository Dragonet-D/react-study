const fs = require('fs');
const router = require('koa-router')();

const files = fs.readdirSync(`${__dirname}/controllers`);

const jsFiles = files.filter(f => {
  return f.endsWith('.js')
});

function addMapping(router, mapping) {
  for (const url in mapping) {
    if (mapping.hasOwnProperty(url)) {
      if (url.startsWith('GET ')) {
        const path = url.substring(4);
        router.get(path, mapping[url]);
      } else if (url.startsWith('POST ')) {
        const path = url.substring(5);
        router.post(path, mapping[url]);
      } else {
        console.log('invalid url');
      }
    }
  }
}

function addControllers(router, dir) {
  fs.readdirSync(`${__dirname}/${dir}`).filter(f => f.endsWith('.js'))
    .forEach(ff => {
      const mapping = require(`${__dirname}/${dir}/${ff}`);
      addMapping(router, mapping);
    })
}

module.exports = dir => {
  const controllersDir = dir || 'controllers';
  addControllers(router, controllersDir);
  return router.routes();
};
