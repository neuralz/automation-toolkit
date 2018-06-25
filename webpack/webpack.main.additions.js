const webpack = require('webpack');
const IgnoreWarningPlugin = require('./ignore-warning-plugin');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    new IgnoreWarningPlugin()
  ]
}
