const webpack = require('webpack'),
      path = require('path');

const PATHS = {
  main: './src/main.js',
  html: './index.html',
  public: path.join(__dirname, 'public')
};

module.exports = {
  entry: {
    javascript: PATHS.main,
    html: PATHS.html
  },
  output: {
    path: PATHS.public,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: PATHS.public
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  },
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery'
    }
  }
};
