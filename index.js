const cluster = require('cluster')
const config = require('./lib/config')
const workers = config.server.forkByCpu ? require('os').cpus().length : 0
const port = config.server.port
const logger = require('./lib/logger')

if (workers > 0 && cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < workers; i++) {
    cluster.fork()
  }

  logger.info(`Forked ${workers} workers.`)
  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died. Code ${code}. Signal ${signal}.`)
    logger.info('Starting a new worker')
    cluster.fork()
  })
} else {
  // Workers can share any TCP connection, in this case it is an HTTP server
  require('./lib/server').listen(port)
}

// log application ready
if (workers === 0 || cluster.isMaster) {
  logger.info(`Application available at http://localhost:${port}/`)
}
