const config = require('./default');

const prod = {
  level: 'warn'
}

config.level = prod.level

module.exports = config
