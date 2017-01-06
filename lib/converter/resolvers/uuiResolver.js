
class UuidResolver {
  constructor() {
    this.map = new Map()
  }

  put(uuid, resolver) {
    this.map[uuid] = resolver
  }

  getContent(uuid, path) {
    return new Promise((resolve) => {
      const resolver = this.map[uuid]
      resolve(resolver.getFile(path))
    })
  }

  del(uuid) {
    delete this.map[uuid];
  }

}

class UuidResolverSingleton {

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new UuidResolver()
    }

    return this.instance
  }

}

module.exports = UuidResolverSingleton.getInstance()
