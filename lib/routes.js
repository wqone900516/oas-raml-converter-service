const pjson = require('../package.json')
const fileUpload = require('./helper/fileupload');
const tmp = require('tmp');
var mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const logger = require('./logger')
const del = require('del');
const config = require('./config')

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
    _convert(req, res, OasRamlConverter.convertSwaggerToRaml, OasRamlConverter.convertFileSwaggerToRaml)
  })

  app.post('/raml08/to/raml', (req, res) => {
    _convert(req, res, OasRamlConverter.convertRamlToRaml, OasRamlConverter.convertFileRamlToRaml)
  })

  // curl -i  -X POST -F "srcFile=@/tmp/api.raml" http://localhost:3000/raml/to/swagger
  app.post('/raml/to/swagger', (req, res) => {
    _convert(req, res, OasRamlConverter.convertRamlToSwagger, OasRamlConverter.convertFileRamlToSwagger)
  })

  // curl -i  -X POST -F "srcFile=@/tmp/api.raml" http://localhost:3000/raml08/to/swagger
  app.post('/raml08/to/swagger', (req, res) => {
    _convert(req, res, OasRamlConverter.convertRaml08ToSwagger, OasRamlConverter.convertFileRaml08ToSwagger)
  })

  function _convert(req, res, converter, convertFile) {
    if (!req.files || req.reqFiles.length === 1) {
      _convertStringToString(req, res, converter)
    } else {
      _convertMultipleFiles(req, res, convertFile)
    }
  }

  function _convertMultipleFiles(req, res, converter) {
    let rootPath = null

    const tempDir = new Promise(function (resolve, reject) {
      tmp.dir({prefix: 'oasRamlConv_'}, (err, path) => {
        if (err) {
          reject(err);
        }
        logger.debug('tempFile: ' + path)
        rootPath = path  + '/'
        resolve(rootPath);
      })
    }).then((path) => {
      return Promise.all(req.reqFiles.map(f => new Promise(function (resolve, reject) {
          const filePath = path + f
          mkdirp(getDirName(filePath), function (err) {
            if (err) {
              return reject(err);
            }
            resolve({filePath: filePath, fileName: f});
          });
        }
      ).then((file) => {
          return new Promise(function (resolve, reject) {
              req.files[file.fileName].mv(file.filePath, function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              })
            }
          )
        }
      ).catch((err) => {
        return Promise.reject(err)
      })))
    }).catch((err) => {
      return Promise.reject(err)
    })

    logger.debug('rootFile: ' + req.rootFile)

    tempDir.then(() => {
      converter(rootPath + req.rootFile).then((file) => {
        res.status(200).send(file)
        if (!config.keepTempFiles) {
          del(rootPath, {force: true})
        }
      }).catch((err) => {
        res.status(400).send('Cannot Convert: ' + err.message)
        if (!config.keepTempFiles) {
          del(rootPath, {force: true})
        }
      })
    }).catch((err)=> {
      res.status(400).send('fail: ' + err)
      if (!config.keepTempFiles) {
        del(rootPath, {force: true})
      }
    })
  }

  function _convertStringToString(req, res, converter) {
    let srcFile = null
    if (!req.files) {
      srcFile = req.text
    } else {
      const buf = req.files[req.rootFile].data;
      srcFile = buf.toString('utf-8')
    }
    converter(srcFile).then((file) => {
      res.status(200).send(file)
    }).catch((err) => {
      res.status(400).send('Cannot Convert: ' + err.message)
    })
  }
}
