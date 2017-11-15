const Middleware = require('sk/core/Middleware')


/**
 * Middleware to load RAW files (i.e., the raw data without any convertions).
 */
class JsonMiddleware extends Middleware {
  validate() {
    return true
  }

  process(resource) {
    return resource.rawData
  }
}


module.exports = JsonMiddleware