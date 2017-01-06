
class MultipartFormResolver {

  constructor(req) {
    this.req = req
  }

  getFile(path) {
    const buf = this.req.files[path].data
    return buf.toString('utf-8')
  }

}

module.exports = MultipartFormResolver
