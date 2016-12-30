const config = require('./config')
const logger = require('./logger')
const morgan2Logger = require('./middlewares/morgan2Logger');
const OasRamlConverter = require('./converter/oasRamlConverter')

if (config.newrelic.enabled) {
  process.env.NEW_RELIC_ENABLED = true;
  process.env.NEW_RELIC_NO_CONFIG_FILE = true;
  process.env.NEW_RELIC_LICENSE_KEY = config.newrelic.licenseKey;
  process.env.NEW_RELIC_APP_NAME = config.newrelic.appName || 'API Designer Experience Api  (' + config.env + ')';
  process.env.NEW_RELIC_IGNORING_RULES = config.newrelic.ignoreRules;
  process.env.NEW_RELIC_LOG_LEVEL = config.newrelic.level
  require('newrelic');
  logger.info('newrelic initialized');
}

const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors');

const routes = require('./routes')
const expressApp = express()

expressApp.disable('x-powered-by')
expressApp.use(compression())
expressApp.use(bodyParser.json())
expressApp.use(cors());
expressApp.use(morgan2Logger);

routes(expressApp, OasRamlConverter)

module.exports.listen = (port) => {
  expressApp.listen(port)
}
