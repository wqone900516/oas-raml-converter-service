const tmp = require('tmp');
var mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const logger = require('../logger')
const del = require('del');
const config = require('../config')
const AdmZip = require('adm-zip');

function _convertFromZipFile(req, res, converter, rootFile) {

  const tempDir = _createTempDir().then((path) => {
    return new Promise(function (resolve, reject) {
        const zipFile = path + '_zip.zip'
        logger.debug('zipFile: ' + zipFile)
        req.files[req.rootFile].mv(zipFile, function (err) {
          if (err) {
            reject(err);
          } else {
            try {
              var zip = new AdmZip(zipFile);
              zip.extractAllTo(path, true)
              resolve(path);
            } catch (err) {
              reject(err)
            }
          }
        })
      }
    )
  })

  _buildResponseMultipleFile(tempDir, res, converter, rootFile)
}

function _buildResponseMultipleFile(promise, res, converter, rootFile) {
  promise.then((rootPath) => {
    converter(rootPath + rootFile).then((file) => {
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
  })
}


function _createTempDir() {
  return new Promise(function (resolve, reject) {
    tmp.setGracefulCleanup()
    tmp.dir({prefix: 'oasRamlConv_'}, (err, path) => {
      if (err) {
        reject(err);
      }
      logger.debug('tempFile: ' + path)
      resolve(path  + '/');
    })
  })
}

function _convertMultipleFiles(req, res, converter) {

  const tempDir = _createTempDir().then((path) => {
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
    }))).then(() => {
      return Promise.resolve(path)
    }).catch(err => {
      return Promise.reject(err)
    })
  }).catch((err) => {
    return Promise.reject(err)
  })

  logger.debug('rootFile: ' + req.rootFile)

  _buildResponseMultipleFile(tempDir, res, converter, req.rootFile)
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

function convert(req, res, converter, convertFile) {
  if (req.headers['zip-root-file']) {
    _convertFromZipFile(req, res, convertFile, req.headers['zip-root-file'])
  } else {
    if (!req.files || req.reqFiles.length === 1) {
      _convertStringToString(req, res, converter)
    } else {
      _convertMultipleFiles(req, res, convertFile)
    }
  }
}

module.exports = convert
