require('dotenv-loader').load();

import env from '../utils/env';
import createLogger from '../utils/logger';
import createServer from './createServer';

const PORT = env.get('PORT');
const logger = createLogger(console);

const appSettings = {
  publicPath: '/assets/',
};

const settings = {
  keys: env.get('APP_SECRET'),
  session: {
    key: env.get('APP_SECRET'),
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,
    renew: true,
  },
};

const server = createServer(appSettings, settings, env, logger);
server.start(PORT);
