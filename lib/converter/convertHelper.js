const fileUpload = require('../helper/fileupload');
const tmp = require('tmp');
var mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const logger = require('../logger')
const del = require('del');
const config = require('../config')
const AdmZip = require('adm-zip');


function _convertFromZipFile(req, res, converter, rootFile) {

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
    return new Promise(function (resolve, reject) {
        const zipFile = path + "_zip.zip"
        logger.debug('zipFile: ' + zipFile)
        req.files[req.rootFile].mv(zipFile, function (err) {
          if (err) {
            reject(err);
          } else {
            try {
              var zip = new AdmZip(zipFile);
              zip.extractAllTo(path, true)
              resolve();
            } catch (err) {
              reject(err)
            }
          }
        })
      }
    )
  })

  tempDir.then(() => {
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
    if (!config.keepTempFiles) {
      del(rootPath, {force: true})
    }
  })

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