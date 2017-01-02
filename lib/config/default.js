const config = {
  server: {
    port: process.env.SERVER_PORT || 3000,
    forkByCpu: process.env.SERVER_FORK_BY_CPU || false
  },
  logger: {
    console: {
      enabled: true,
      level: 'debug',
      timestamp: true,
      prettyPrint: true,
      colorize: true
    }
  },
  level: 'info',

  newrelic: {
    enabled: false
  },

  keepTempFiles: false
}

module.exports = config
