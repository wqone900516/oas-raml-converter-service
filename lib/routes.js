const pjson = require('../package.json')

module.exports = (app, oasRamlConverter) => {
  app.get('/ping', (req, res) => {
    res.send({currentDate: new Date(), version: pjson.version})
  })

  app.get('/status', (req, res) => {
    res.send({currentDate: new Date(), version: pjson.version})
  })

  app.put('/swgger/to/raml', (req, res) => {
    oasRamlConverter.convertSwaggerToRaml()
  })

}
