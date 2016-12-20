import EventEmitter from 'core/EventEmitter'
import {tryToInstantiate} from 'utils'


/**
 * 
 */
export default class Entity extends EventEmitter {
  constructor(...args) {
    super(...args)

    this._tags = []
    this._game = null
    this._scene = null

    this._behaviors = {}

    this.updatable = true
    this.alive = true
  }

  get tags() { return this._tags }
  get game() { return this._game }
  get scene() { return this._scene }
  get behaviors() { return this._behaviors }

  setup(game, scene) {
    this._game = game
    this._scene = scene
  }

  update(delta) {
    for (let name in this._behaviors) {
      this._behaviors[name].update(delta)
    }
  }

  addBehavior(behavior) {
    behavior = tryToInstantiate(behavior)

    if (!behavior) {
      throw new Error(`You must provide a behavior.`)
    }

    if (!behavior.name) {
      throw new Error(`Trying to add a behavior without a name.`)
    }

    if (this._behaviors[behavior.name]) {
      throw new Error(`Trying to add a behavior with the same name of one `+
                      `already registered.`)
    }

    behavior.setup(this)
    this._behaviors[behavior.name] = behavior
  }

  removeBehavior(behaviorOrName) {
    if (!behaviorOrName) {
      throw new Error(`You must provide a behavior or a behavior name to `+
                      `remove it from Entity.`)
    }

    // remove the behavior by key
    if (typeof behaviorOrName === 'string') {
      delete this._behaviors[behaviorOrName]

    // remove behavior by object
    } else {
      let behaviors = this._behaviors
      let names = Object.keys(behaviors)
      let name = names.find(key => behaviors[key] === behaviorOrName)

      if (name) delete this._behaviors[name]
    }
  }

  hasBehavior(behaviorName) {
    return !!this._behaviors[behaviorName]
  }
}
