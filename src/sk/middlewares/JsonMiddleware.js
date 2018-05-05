const Middleware = require('sk/core/Middleware')

class JsonMiddleware extends Middleware {
  process(resource) {
    return resource.rawData
  }
}

module.exports = JsonMiddleware