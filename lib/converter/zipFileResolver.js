const AdmZip = require('adm-zip');


class ZipResolver {
  constructor(zipBuff) {
    this.zip = AdmZip(zipBuff)
  }

  getFile(path) {
    return Promise.resolve (this.zip.readAsText(path))
  }
}

module.exports = ZipResolver