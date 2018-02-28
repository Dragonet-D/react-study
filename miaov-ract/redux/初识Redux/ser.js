const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./cfg/dev');
const OpenBrowser = require('open-browser-webpack-plugin');

let port = 9000;

config.plugins.push(new OpenBrowser({url: `http://localhost:${port}`}));

config.entry.unshift(
    `webpack-dev-server/client?http://localhost:${port}`,
    'webpack/hot/dev-server'
)

const compiler = webpack(config);

new WebpackDevServer(compiler, {
    hot: true,
    contentBase: './src/',
    publicPath: '/assets/'
})
.listen(port)
