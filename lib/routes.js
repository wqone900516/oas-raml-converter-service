const pjson = require('../package.json')
var fileUpload = require('express-fileupload');

module.exports = (app, OasRamlConverter) => {

  app.use(fileUpload());

  app.get('/status', (req, res) => {
    res.send({currentDate: new Date(), version: pjson.version})
  })

  app.post('/swagger/to/raml', (req, res) => {
    _convertStringToString(req, res, OasRamlConverter.convertSwaggerToRaml)
  })

  app.post('/raml08/to/raml', (req, res) => {
    _convertStringToString(req, res, OasRamlConverter.convertRamlToRaml)
  })

  app.post('/raml/to/swagger', (req, res) => {
    _convertStringToString(req, res, OasRamlConverter.convertRamlToSwagger)
  })

  app.post('/raml08/to/swagger', (req, res) => {
    _convertStringToString(req, res, OasRamlConverter.convertRaml08ToSwagger)
  })


  function _convertStringToString(req, res, converter) {
    if (!req.files) {
      res.statusCode(401).send('No files were uploaded.');
      return;
    }
    const buf = req.files.srcFile.data;

    const srcFile = buf.toString('utf-8')
    converter(srcFile).then((file) => {
      res.status(200).send(file)
    }).catch((err) => {
      res.status(400).send("Cannot Convert: " + err.message)
    })
  }



}
