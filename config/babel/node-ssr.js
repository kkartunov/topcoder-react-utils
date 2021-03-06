/* Babel preset for NodeJS build with support of server-side JSX rendering. */

const _ = require('lodash');
const getWebpackBabelConfig = require('./webpack');

function getConfig(babel, ops = {}) {
  const config = getWebpackBabelConfig(babel);

  const cssModulesTransformPluginOps = {
    extensions: ['.css', '.scss'],
  };

  const transformAssetsPluginOptions = {
    extensions: ['gif', 'jpeg', 'jpg', 'png'],
  };

  config.plugins = config.plugins.concat([
    'dynamic-import-node',
    ['transform-assets', transformAssetsPluginOptions],
    ['css-modules-transform', cssModulesTransformPluginOps],
  ]);

  const moduleResolverPluginOps = config.plugins.find(
    x => x[0] === 'module-resolver',
  )[1];

  moduleResolverPluginOps.transformFunctions = [
    'resolveWeak',
    'webpack.resolveWeak',
  ];

  switch (babel.getEnv()) {
    case 'development':
      _.pull(config.plugins, 'react-hot-loader/babel');
      cssModulesTransformPluginOps.generateScopedName = '[path][name]___[local]___[hash:base64:6]';
      break;
    case 'production':
      cssModulesTransformPluginOps.generateScopedName = '[hash:base64:6]';
      break;
    case 'test':
      cssModulesTransformPluginOps.generateScopedName = '[path][name]___[local]___[hash:base64:6]';
      break;
    default:
  }

  const baseAssetsOutputPath = ops.baseAssetsOutputPath || '';
  transformAssetsPluginOptions.name = `${
    baseAssetsOutputPath}/images/[hash].[ext]`;

  return config;
}

module.exports = getConfig;
