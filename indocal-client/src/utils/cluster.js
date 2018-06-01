// @flow

import os from 'os';
import cluster from 'cluster';

import typeof Env from './env';
import typeof Logger from './logger';

const cleanExit = true;

export default function createCluster(
  env: Env,
  logger: Logger
): {shouldRunTask: boolean} {
  const NUM_WORKER = parseInt(env.get('NUM_WORKER'), 10) || os.cpus().length;

  // eslint-disable-next-line
  function eachWorker(cb: Function): void {
    for (const id in cluster.workers) {
      return cb(cluster.workers[id]);
    }
  }

  function killWorkers(): void {
    eachWorker(worker => {
      const pid = worker.process.id;
      try {
        logger.info('Killing child with PID', pid);
        process.kill(pid, 'SIGTERM');
      } catch (e) {
        logger.warn('Cannot kill child with PID ', pid, ': ', e.message);
      }
    });
  }

  if (cluster.isMaster) {
    process.on('exit', () => {
      logger.info('Master process finished');
      if (!cleanExit) process.exit(1);
    });
    process.on('SIGTERM', () => {
      logger.info('Master process receives SIGTERM, killing workers');
      killWorkers();
    });

    for (let i = 0; i < NUM_WORKER; i++) {
      if (cluster.isMaster) cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      if (code !== 0 && signal !== 'SIGTERM') {
        logger.error(
          `Worker exited with code ${code} and signal ${signal}. Restarting...`
        );
        killWorkers();
      } else {
        logger.info(`Worker ${worker.process.id} died`);
      }
    });
    logger.info('Master process spawned with PID', process.pid);
  } else {
    logger.info('Worker Proccess Spawned with PID', process.pid);
  }

  return {
    shouldRunTask: !cluster.isMaster,
  };
}
