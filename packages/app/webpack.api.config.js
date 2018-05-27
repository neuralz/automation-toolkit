const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'api-server.js',
    libraryTarget: "commonjs"
  },
  externals: [
    /^[a-z\-0-9]+$/ // Ignore node_modules folder
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  devtool: 'source-map',
  plugins: [],
  entry: {
    main: '../api/src/server.ts'
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};
