import _components from 'globals_/components'
import _displayObjects from 'globals_/displayObjects'

export default class Entity {
  constructor(game, scene, display, components) {
    this._game = game
    this._scene = scene

    this._name = null
    this._display = null
    this._components = {}
    this._$components = null

    // Create the display object
    {
      let D = _displayObjects[display]
      this._display = new D()
    }

    // Create the components
    for (let i=0; i<components.length; i++) {
      let name = components[i]
      let C = _components[name]
      let c = new C(this)

      let access = c.access || name
      this._components[access] = c
    }
    Object.freeze(this._components)

    // User initialize function
    this.initialize()
  }

  get game() { return this._game }
  get scene() { return this._scene }
  get name() { return this._name }
  get display() { return this._display }
  get components() { return this._components }
  get c() { return this._components }
  get $components() { return this._$components }

  initialize() {}
  
  hasComponent(name) {
    return !!this._components[name]
  }
  
  toJson() {
    let result = {
      name       : this._name,
      components : {}
    }

    for (let key in this._components) {
      let c = this._components[key]
      result.components[key] = c.toJson()
    }

    return result
  }

  fromJson(data) {
    for (let key in data.components) {
      let params = data.components[key]

      this._components[key].fromJson(params)
    }
  }
}
Entity.prototype.has = Entity.prototype.hasComponent