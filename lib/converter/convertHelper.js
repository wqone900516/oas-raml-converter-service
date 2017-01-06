const config = require('../config')
const uuidV4 = require('uuid/v4');
const MultiPartFileResolver = require('./resolvers/multiPartFileResolver');
const ZipFileResolver = require('./resolvers/zipFileResolver');

class ConvertHelper {

  static _buildResponseMultipleFile(promise, res, converter, rootFile) {
    return new Promise((resolve) => { promise.then((rootPath) => {
        converter(rootPath + rootFile).then((file) => {
          res.status(200).send(file)
          resolve()
        }).catch((err) => {
          res.status(400).send('Cannot Convert: ' + err.message)
          resolve()
        })
      }).catch((err)=> {
        res.status(400).send('fail: ' + err)
        resolve()
      })
    })
  }

  static _convertStringToString(req, res, converter) {
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

  static convertByUrl(req, res, convertFile) {
    if (req.query.url)  {
      ConvertHelper._buildResponseMultipleFile(Promise.resolve(req.query.url),res,convertFile, '')
    } else {
      res.status(400).send({message: 'url param is required'})
    }
  }

  static _convertByUrlString(url, res, convertFile, uuidResolver, uuid) {
    ConvertHelper._buildResponseMultipleFile(Promise.resolve(url),res,convertFile, '').then(()=> {
      uuidResolver.del(uuid)
    })
  }

  static convert(req, res, converter, convertFile, uuidResolver) {

    const zipRootFile = 'zip-root-file';
    if (!req.query[zipRootFile] && (!req.files || req.reqFiles.length === 1)) {
      ConvertHelper._convertStringToString(req, res, converter)
    } else {
      let rootFile = ''
      const uuid = uuidV4()
      if (req.query[zipRootFile]) {
        rootFile = req.query[zipRootFile]
        uuidResolver.put(uuid, new ZipFileResolver(req.files[req.rootFile].data))
      } else {
        rootFile = req.rootFile
        uuidResolver.put(uuid, new MultiPartFileResolver(req))
      }
      ConvertHelper._convertByUrlString('http://localhost:' + config.server.port + '/file/' + uuid + '/' + rootFile, res, convertFile, uuidResolver, uuid)
    }
  }

}

module.exports = ConvertHelper
