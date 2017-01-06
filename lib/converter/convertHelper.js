const config = require('../config')
const uuidV4 = require('uuid/v4');
const MultiPartFileResolver = require('./resolvers/multiPartFileResolver');
const ZipFileResolver = require('./resolvers/zipFileResolver');

class ConvertHelper {

  static _buildResponseMultipleFile(promise, converter, rootFile) {
    return new Promise((resolve, reject) => { promise.then((rootPath) => {
        converter(rootPath + rootFile).then((file) => {
          resolve(file)
        }).catch((err) => {
          reject('Cannot Convert: ' + err.message)
        })
      }).catch((err)=> {
        reject('fail: ' + err)
      })
    })
  }

  static _convertStringToString(req, converter) {
    return new Promise((resolve, reject) => {
      let srcFile = null
      if (!req.files) {
        srcFile = req.text
      } else {
        const buf = req.files[req.rootFile].data;
        srcFile = buf.toString('utf-8')
      }
      converter(srcFile).then((file) => {
        resolve(file)
      }).catch((err) => {
        reject('Cannot Convert: ' + err.message)
      })
    })
  }

  static convertByUrl(req, convertFile) {
    if (req.query.url)  {
      return ConvertHelper._buildResponseMultipleFile(Promise.resolve(req.query.url), convertFile, '')
    } else {
      return Promise.reject({message: 'url param is required'})
    }
  }

  static _convertByUrlString(url, convertFile, uuidResolver, uuid) {
    return new Promise((resolve, reject) => {
      ConvertHelper._buildResponseMultipleFile(Promise.resolve(url), convertFile, '').then((file)=> {
        uuidResolver.del(uuid)
        resolve(file)
      }).catch(err => {
        uuidResolver.del(uuid)
        reject(err)
      })
    })
  }

  static convert(req, converter, convertFile, uuidResolver) {
    const zipRootFile = 'zip-root-file';
    if (!req.query[zipRootFile] && (!req.files || req.reqFiles.length === 1)) {
      return ConvertHelper._convertStringToString(req, converter)
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
      return ConvertHelper._convertByUrlString('http://localhost:' + config.server.port + '/file/' + uuid + '/' + rootFile, convertFile, uuidResolver, uuid)
    }
  }

}

module.exports = ConvertHelper
