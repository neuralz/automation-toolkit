const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  devtool: 'source-map',
  plugins: [],
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
      whitelist: ['aqueduct']
    })
  ]
};
