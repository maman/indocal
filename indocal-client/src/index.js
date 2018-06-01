// @flow

import env from './utils/env';
import createLogger from './utils/logger';
import createCluster from './utils/cluster';

const isProd = env.get('NODE_ENV') === 'production';

if (isProd) {
  const logger = createLogger(console);
  const {shouldRunTask} = createCluster(env, logger);
  if (shouldRunTask) {
    require('./server');
  }
} else {
  require('./server');
}
