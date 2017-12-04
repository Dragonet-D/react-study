const env = process.env.NODE_ENV.replace(/(\s*$)|(^\s*)/ig,"");
const config = require(`./config/webpack.${env}.js`)(env);

module.exports = config;