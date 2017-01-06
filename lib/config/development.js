const config = require('./default');

const dev = {
  logger: {
    console: {
      enabled: true,
      level: 'debug',
      timestamp: true,
      prettyPrint: true,
      colorize: true
    }
  },
  level: 'debug',
  newrelic: {
    enabled: true,
    licenseKey: '709d71fdc7267493c0b0b5bb9462f02db50e33a2',
    appName: 'OAS Raml Converter Service (development)',
    level: 'debug'
  },
  keepTempFiles: true
}

config.logger  = dev.logger
config.level = dev.level
config.newrelic = dev.newrelic

module.exports = config
