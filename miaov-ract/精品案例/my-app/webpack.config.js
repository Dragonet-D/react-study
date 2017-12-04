const path = require('path');
const webpack = require('webpack');
const Html = require('html-webpack-plugin');
const CleanFolder = require('clean-webpack-plugin');

const rv = (...a) => path.resolve(__dirname, ...a);

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: rv('dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
    chunkFilename: '[name].sepChunk.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: [rv('node_modules')]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new Html({
      name: 'index.html',
      template: './src/index.html'
    }),
    new CleanFolder(['dist']),
    new webpack.ProvidePlugin({
      React: 'react',
      Component: ['react', 'Component'],
      ReactDom: 'react-dom',
      _: 'lodash',
      Route: ['react-router-dom', 'Route'],
      Router: ['react-router-dom', 'BrowserRouter'],
      connect: ['react-redux', 'connect'],
      Provide: ['react-redux', 'Privide']
    })
  ],
  resolve: {
    modules: [
      'node_modules',
      rv('./src'),
      rv('./src/common'),
      rv('./src/routes'),
      rv('./src/component')
    ]
  },
  devServer: {
    historyApiFallback: true,
    open: true
  }
}