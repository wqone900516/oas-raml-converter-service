const pjson = require('../package.json')
const fileUpload = require('./helper/fileupload');
const ConvertHelper = require('./converter/convertHelper');
const convert = ConvertHelper.convert
const uuidResolver = require('./converter/uuiResolver');


module.exports = (app, OasRamlConverter) => {
  app.use(function (req, res, next) {
    if (req.is('text/*')) {
      req.text = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) { req.text += chunk });
      req.on('end', next);
    } else {
      next();
    }
  });

  app.use(fileUpload());

  app.get('/status', (req, res) => {
    res.send({currentDate: new Date(), version: pjson.version})
  })

  // curl -i  -X POST -F "srcFile=@/tmp/swagger.json" http://localhost:3000/swagger/to/raml
  // curl -i -H "Content-type: text/plain"  -X POST http://localhost:3000/swagger/to/raml -d '{"swagger":"2.0","info":{"version":"1.0.development","title":"Sample API","description":""},"host":"mocksvc.mulesoft.com","basePath":"/mocks/63da46a7-330b-4448-8100-e7b529c37881/api/","schemes":["https"],"paths":{"/employees":{"post":{"operationId":"POST_employees","description":"Create a new employee","consumes":["application/json"],"produces":["application/json"],"responses":{"200":{"description":"","examples":{"application/json":{"message":"Employee successfully created."}}}}}}},"definitions":{}}'
  app.post('/swagger/to/raml', (req, res) => {
    convert(req, res, OasRamlConverter.convertSwaggerToRaml, OasRamlConverter.convertFileSwaggerToRaml,uuidResolver)
  })

  app.post('/raml08/to/raml', (req, res) => {
    convert(req, res, OasRamlConverter.convertRamlToRaml, OasRamlConverter.convertFileRamlToRaml, uuidResolver)
  })

  // curl -i  -X POST -F "srcFile=@/tmp/api.raml" http://localhost:3000/raml/to/swagger
  app.post('/raml/to/swagger', (req, res) => {
    convert(req, res, OasRamlConverter.convertRamlToSwagger, OasRamlConverter.convertFileRamlToSwagger, uuidResolver)
  })

  // curl -i  -X POST -F "srcFile=@/tmp/api.raml" http://localhost:3000/raml08/to/swagger
  app.post('/raml08/to/swagger', (req, res) => {
    convert(req, res, OasRamlConverter.convertRaml08ToSwagger, OasRamlConverter.convertFileRaml08ToSwagger, uuidResolver)
  })

  app.get('/swagger/to/raml', (req, res) => {
    ConvertHelper.convertByUrl(req, res, OasRamlConverter.convertFileSwaggerToRaml)
  })

  app.get('/raml08/to/raml', (req, res) => {
    ConvertHelper.convertByUrl(req, res, OasRamlConverter.convertFileRamlToRaml)
  })

  // curl -i  -X POST -F "srcFile=@/tmp/api.raml" http://localhost:3000/raml/to/swagger
  app.get('/raml/to/swagger', (req, res) => {
    ConvertHelper.convertByUrl(req, res, OasRamlConverter.convertFileRamlToSwagger)
  })

  // curl -i  -X POST -F "srcFile=@/tmp/api.raml" http://localhost:3000/raml08/to/swagger
  app.get('/raml08/to/swagger', (req, res) => {
    ConvertHelper.convertByUrl(req, res, OasRamlConverter.convertFileRaml08ToSwagger)
  })

  app.get('/file/:uuid/*', (req, res) => {
    const uuid = req.params.uuid
    const filePath = req.path.replace(`/file/${uuid}/`, '')
    uuidResolver.getContent(uuid, filePath).then((content)=> {
      res.send(content)
    }).catch(err => {
      res.status(400).end()
    })
  })

}
