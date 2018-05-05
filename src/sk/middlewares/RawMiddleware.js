const Middleware = require('sk/core/Middleware')

class RawMiddleware extends Middleware {
  process(resource) {
    return resource.rawData
  }
}

module.exports = RawMiddleware