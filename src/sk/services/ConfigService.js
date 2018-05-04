const Service = require('sk/core/Service')
const configDefaults = require('sk/config/defaults')

class ConfigService extends Service {
  constructor() {
    super()
    
    this._config = {}
    this.load(configDefaults)
  }

  clear() {
    this._config = {}
  }

  load(config={}){
    this._config = Object.assign(this._config, config)
  }

  set(name, value) {
    this._config[name] = value
  }

  get(name, default_=null) {
    let value = this._config[name]
    return (typeof value === 'undefined')? default_ : value
  }
}

module.exports = ConfigService
