const utils = require('sk/utils')
const Manager = require('sk/core/Manager')
const Service = require('sk/core/Service')
const Signal = require('sk/core/Signal')

TYPES = utils.enumeration({
  MANAGER   : 'managers',
  SERVICE   : 'services',
  SIGNAL    : 'signals',
  PROVIDER  : 'providers',
  FACTORY   : 'factories',
  INSTANCE  : 'instances'
})

class InjectionTarget {
  constructor(id, target, type, stateless=false) {
    this.id = id
    this.target = target
    this.type = type
    this.stateless = stateless
  }

  getObject() {
    if (this.type === TYPES.PROVIDER) {
      return this.target()
    
    } else if (this.type === TYPES.INSTANCE) {
      return this.target
    
    } else {
      return new this.target()
    }
  }
}

class Injector {
  constructor() {
    this._injectionPool = {}
    this._resolveStack = []

    this.managers = []
    this.services = []
    this.signals = []
    this.factories = []
    this.instances = []
    this.providers = []

    this.container = {}
  }

  _register(id, target, type, stateless=false) {
    if (this._injectionPool[id]) {
      throw new Error(`An object with "${id}" is already registered in the injector.`)
    }

    this._injectionPool[id] = new InjectionTarget(id, target, type, stateless)
  }

  registerManager(id, target) {
    if (!target || !target.prototype || !(target.prototype instanceof Manager)) {
      throw new Error(
        `Invalid type for manager "${id}". ` +
        `A manager must be a class inheriting from sk.core.Manager.`
      )
    } 

    this._register(id, target, TYPES.MANAGER)
  }
  registerService(id, target) {
    if (!target || !target.prototype || !(target.prototype instanceof Service)) {
      throw new Error(
        `Invalid type for service "${id}". ` +
        `A service must be a class inheriting from sk.core.Service.`
      )
    } 

    this._register(id, target, TYPES.SERVICE)
  }
  registerSignal(id, target) {
    if (!target || !target.prototype || !(target.prototype instanceof Signal)) {
      throw new Error(
        `Invalid type for signal "${id}". ` +
        `A signal must be a class inheriting from sk.core.Signal.`
      )
    } 

    this._register(id, target, TYPES.SIGNAL)
  }
  registerFactory(id, target, stateless=false) {
    this._register(id, target, TYPES.FACTORY, stateless)
  }
  registerProvider(id, target, stateless=false) {
    this._register(id, target, TYPES.PROVIDER, stateless)
  }
  registerInstance(id, target) {
    this._register(id, target, TYPES.INSTANCE)
  }

  build() {
    Object
      .keys(this._injectionPool)
      .forEach((x) => this.resolve(x))
  }

  resolve(id) {
    if (this.container[id]) {
      return this.container[id]
    }

    if (!this._injectionPool[id]) {
      throw new Error(`Trying to inject an undefined object with id "${id}".`)
    }

    if (this._resolveStack.indexOf(id) >= 0) {
      this._resolveStack = []
      throw new Error(`Cyclic reference detected while injecting "${id}".`)
    }

    let target = this._injectionPool[id]
    let object = null
    this._resolveStack.push(id)
    try {
      object = target.getObject()
    } catch(e) {
      this._resolveStack = []
      console.error(`Could not inject the object with id "${id}".`)
      throw e
    }
    this._resolveStack.pop()

    if (!target.stateless) {
      this.container[id] = object
      this[target.type].push(object)
    }

    return object
  }
}

module.exports = Injector