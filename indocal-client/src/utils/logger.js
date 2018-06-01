export class Logger {
  constructor(loggerInterface) {
    this.logger = loggerInterface;
  }

  info(...param) {
    this.logger.log(...param);
  }

  warn(...param) {
    this.logger.warn(...param);
  }

  error(...param) {
    this.logger.error(...param);
  }
}

export function createLogger(loggerInterface): Logger {
  return new Logger(loggerInterface);
}

export default createLogger;
