'use strict';
const PerspectivePlugin = require('@finos/perspective-webpack-plugin');

module.exports.getWebpackConfig = (config, options) => ({
  ...config,
  output: {
    ...config.output,
    publicPath: '', // override default '/' for perspective-webpack-plugin
  },
  plugins: [
    ...config.plugins,
    new PerspectivePlugin(),
  ],
});
