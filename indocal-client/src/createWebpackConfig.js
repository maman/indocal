// @flow

import webpack from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import AutoDllPlugin from 'autodll-webpack-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import Visualizer from 'webpack-visualizer-plugin';

import {resolve, webpackExternals} from './utils/toolbelt';

const NODE_MODULES = resolve('node_modules');

function generateEntryConfig(isServer: boolean, isProd: boolean) {
  let entry;
  if (isServer) {
    entry = [resolve('src/server/appRenderer')];
  } else {
    if (isProd) {
      entry = [resolve('src/client/index.web.js')];
    } else {
      entry = [
        'babel-polyfill',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
        resolve('src/client/index.web.js'),
      ];
    }
  }
  return entry;
}

function generateOutputConfig(isServer: boolean, isProd: boolean) {
  let nameTemplate = '[name].js';
  const outputMap = {};
  outputMap.filename = nameTemplate;
  if (isServer) {
    outputMap.path = resolve('dist/server');
    outputMap.libraryTarget = 'commonjs2';
  } else {
    if (isProd) {
      nameTemplate = '[name].[chunkhash].js';
      outputMap.filename = nameTemplate;
      outputMap.chunkFilename = nameTemplate;
    } else {
      outputMap.chunkFilename = nameTemplate;
    }
    outputMap.publicPath = '/assets/';
    outputMap.path = resolve('dist/client');
  }
  return outputMap;
}

function generatePluginSets(isServer: boolean, isProd: boolean) {
  const autoDllConfig = {
    entry: {
      vendor: [
        'react',
        'react-dom',
        'react-native-web',
        'react-redux',
        'redux',
        'apollo-client',
        'history/createBrowserHistory',
        'redux-first-router',
        'redux-first-router-link',
        'redux-devtools-extension/logOnlyInProduction',
        'whatwg-fetch',
      ],
    },
  };
  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
      },
    }),
  ];
  if (isServer) {
    plugins = [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      ...plugins,
    ];
    if (!isProd) {
      plugins = [new WriteFilePlugin(), ...plugins];
    }
  } else {
    plugins = [
      new webpack.optimize.CommonsChunkPlugin({
        names: ['bootstrap'],
        filename: isProd ? '[name].[chunkhash].js' : '[name].js',
        minChunks: Infinity,
      }),
      ...plugins,
    ];
    if (!isProd) {
      plugins = [
        new WriteFilePlugin(),
        ...plugins,
        new ErrorOverlayPlugin(),
        new AutoDllPlugin({...autoDllConfig, filename: '[name].dll.js'}),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
      ];
    } else {
      if (!isServer) {
        const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
        const uglifyOptions = {
          cache: false,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            compress: true,
            mangle: true,
            ie8: false,
          },
        };
        plugins = [
          new Visualizer(),
          new StatsPlugin('stats.json'),
          ...plugins,
          new UglifyJsPlugin(uglifyOptions),
          new AutoDllPlugin({
            ...autoDllConfig,
            filename: '[name].[hash].dll.js',
            plugins: [new UglifyJsPlugin(uglifyOptions)],
          }),
          new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
          }),
          new webpack.HashedModuleIdsPlugin(),
        ];
      }
    }
  }
  return plugins;
}

export type WebpackOutputType = {
  filename: string,
  path: string,
  publicPath: string,
  chunkFilename?: string,
  libraryTarget?: string,
};

export type WebpackPluginsType = *[];

export type WebpackModuleType = {
  test: RegExp,
  exclude: RegExp,
  use: string,
};

export type WebpackModulesType = {
  rules: WebpackModuleType[],
};

export type WebpackConfigType = {
  name: string,
  target: string,
  devtool: string,
  entry: string | string[],
  output: WebpackOutputType,
  plugins: WebpackPluginsType,
  module: WebpackModulesType,
};

module.exports = function createWebpackConfig(
  isServer: boolean,
  isProd: boolean
): WebpackConfigType {
  const name = isServer ? 'server' : 'client';
  const target = isServer ? 'node' : 'web';
  const devtool = isProd ? 'source-map' : 'eval-source-map';
  const config = {};
  config.name = name;
  config.target = target;
  config.devtool = devtool;
  config.entry = generateEntryConfig(isServer, isProd);
  config.output = generateOutputConfig(isServer, isProd);
  config.plugins = generatePluginSets(isServer, isProd);
  config.module = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  };
  if (isServer) {
    const externals = webpackExternals(NODE_MODULES);
    externals['react-dom/server'] = 'commonjs react-dom/server';
    config.externals = externals;
  }
  return config;
};
