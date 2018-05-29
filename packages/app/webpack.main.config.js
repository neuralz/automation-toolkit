const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge.smart(baseConfig, {
  target: 'electron-main',
  entry: {
    main: './src/main.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/icon.png', to: './' }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
});
