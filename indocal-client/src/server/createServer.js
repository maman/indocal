// @flow

import path from 'path';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import noFavicon from 'express-no-favicons';
import bodyParser from 'body-parser';

import typeof Env from '../utils/env';
import typeof Logger from '../utils/logger';

type SettingsObject = {
  [string]: any,
};

export type ServerType = {
  start: number => void,
};

export default function createServer(
  appSettings: SettingsObject,
  settings: SettingsObject,
  env: Env,
  logger: Logger
): ServerType {
  const server = express();
  const isProd = env.get('NODE_ENV') === 'production';
  // const context = createGraphQLContext(env, logger);
  server.use(noFavicon());
  server.use(helmet());
  // server.use(
  //   '/graphql',
  //   bodyParser.json(),
  //   createGraphQLServer(schema, context)
  // );
  // server.use('/graphiql', createGraphiQLServer('/graphql'));

  function doneCallback(): void {
    logger.info('Clearing client module caches');
    Object.keys(require.cache).forEach(id => {
      if (/[/\\]client[/\\]/.test(id)) delete require.cache[id];
    });
  }

  return {
    start(port: number): void {
      if (!isProd) {
        const webpack = require('webpack');
        const webpackDevMiddleware = require('webpack-dev-middleware');
        const webpackHotMiddleware = require('webpack-hot-middleware');
        const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
        const createWebpackConfig = require('../../scripts/createWebpackConfig');
        const clientConfig = createWebpackConfig(false, isProd);
        const serverConfig = createWebpackConfig(true, isProd);
        const multiCompiler = webpack([clientConfig, serverConfig]);
        const clientCompiler = multiCompiler.compilers[0];
        const options = {
          publicPath: appSettings.publicPath,
          stats: {
            colors: true,
          },
        };

        server.use(webpackDevMiddleware(multiCompiler, options));
        server.use(webpackHotMiddleware(clientCompiler));
        server.use(
          webpackHotServerMiddleware(multiCompiler, {
            serverRendererOptions: {outputPath: clientConfig.output.path},
          })
        );

        const chokidar = require('chokidar');

        chokidar
          .watch('./src/server', {
            ignored: /(^|[/\\])\../,
          })
          .on('all', evt => {
            if (evt === 'change') {
              logger.info('Clearing server module caches');
              Object.keys(require.cache).forEach(id => {
                if (/[/\\]server[/\\]/.test(id)) delete require.cache[id];
              });
            }
          });

        multiCompiler.plugin('done', doneCallback);
      } else {
        // $FlowFixMe: suppressing this error: this will be generated on production build
        const clientStats = require('../client/stats.json');
        // $FlowFixMe: suppressing this error: this will be generated on production build
        const serverRender = require('./main').default;
        server.use(
          appSettings.publicPath,
          express.static(path.join(process.cwd(), 'dist/client'))
        );
        server.use(
          serverRender({
            clientStats,
            outputPath: path.join(process.cwd(), 'dist/client'),
          })
        );
      }

      const httpServer = http.createServer(server);

      httpServer.listen(port, undefined, undefined, (err: Error | null) => {
        if (err) {
          logger.error(`Cannot listen on port ${port}`);
        } else {
          logger.info(`Server started on port ${port}`);
        }
      });
    },
  };
}
