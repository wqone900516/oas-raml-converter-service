const logger =  require ('../logger')
const morgan = require('morgan')

const morgan2Logger = morgan('combined', {
  stream: {
    write: (line) => {
      logger.info(line.trim());
    }
  }
});
module.exports = morgan2Logger;
