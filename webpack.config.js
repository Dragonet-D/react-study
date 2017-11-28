let path = require('path');
let webpack = require('webpack');
let HtmlwebpackPlugin = require('html-webpack-plugin');
let Root_PATH = path.resolve(__dirname);
let APP_PATH = path.resolve(Root_PATH,'app');
let BUILD_PATH = path.resolve(Root_PATH,'build');

module.exports = {
    entry:{
        app: path.resolve(APP_PATH,'app.js')
    },
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    //开启 dev source map
    devtool: 'eval-source-map',
    //开启 wabpack dev server
    devServer: {
        historyApiFallback:true,
        hot:true,
        inline:true,
        progress:true
    },
    module: {
        //配置 preLoaders,将eslint 添加进入
        preLoaders: [
            {
                test:/\.js?$/,
                loaders:['eslint'],
                include: APP_PATH
            }
        ],
        //配置 loader，将babel添加进去
        loaders: [
            {
                test:/\.js?&/,
                loaders: ['babel'],
                include: APP_PATH
            }
        ],
        //配置 plugin
        plugins: [
            new HtmlwebpackPlugin({
                title: 'My first react app'
            })
        ]
    }
};