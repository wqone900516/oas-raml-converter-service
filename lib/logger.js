const logger = require('winston')
const config = require('./config');
const options = config.logger

logger.remove(logger.transports.Console);
if (options.console) {
  logger.add(logger.transports.Console, {
    level: options.level,
    levels: options.levels,
    handleExceptions: true,
    colorize: true,
    timestamp: true,
    prettyPrint: true,
    label: options.label
  });
}

logger.setLevels(logger.config.syslog.levels);
logger.addColors(logger.config.syslog.colors)
logger.level = config.level;
logger.debug(JSON.stringify(options))
// options.levels && logger.setLevels(options.levels);
// options.colors && logger.addColors(options.colors);
// logger.warning("Initialized");
module.exports = logger;
