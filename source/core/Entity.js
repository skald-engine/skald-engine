import EventEmitter from 'core/EventEmitter'
import Game from 'core/Game'
import Scene from 'core/Scene'
import {tryToInstantiate} from 'utils'


/**
 * 
 */
export default class Entity extends EventEmitter {
  constructor(game, scene, displayObject, suppressInitialize=false) {
    super()

    if (!game || !(game instanceof Game)) {
      return new TypeError(
        `Trying to instantiate a Game without an instance of sk.Game.`
      )
    }

    if (!scene || !(scene instanceof Scene)) {
      return new TypeError(
        `Trying to instantiate a Scene without an instance of sk.Scene.`
      )
    }

    if (!displayObject) {
      return new TypeError(
        `Trying to instantiate a Scene without a display object.`
      )
    }


    this._tags = []
    this._game = game
    this._scene = scene
    this._displayObject = displayObject

    this._behaviors = {}

    this.updatable = true
    this.alive = true

    if (!suppressInitialize) {
      this.initialize()
    }
  }

  get game() { return this._game }
  get scene() { return this._scene }
  get behaviors() { return this._behaviors }
  get displayObject() { return this._displayObject }

  get tags() { return this._tags || [] }
  set tags(value) { return this._tags = value }

  get x() { return this._displayObject.position.x }
  set x(value) { this._displayObject.position.x = value}

  get y() { return this._displayObject.position.y }
  set y(value) { this._displayObject.position.y = value}

  get position() { return this._displayObject.position }
  set position(value) { this._displayObject.position = value}

  get scale() { return this._displayObject.scale }
  set scale(value) { this._displayObject.scale = value}

  get pivot() { return this._displayObject.pivot }
  set pivot(value) { this._displayObject.pivot = value}

  get skew() { return this._displayObject.skew }
  set skew(value) { this._displayObject.skew = value}

  get rotation() { return this._displayObject.rotation }
  set rotation(value) { this._displayObject.rotation = value}

  get mask() { return this._displayObject.mask }
  set mask(value) { this._displayObject.mask = value}

  get tint() { return this._displayObject.tint }
  set tint(value) { this._displayObject.tint = value}

  get filters() { return this._displayObject.filters }
  set filters(value) { this._displayObject.filters = value}

  initialize() {}

  configure(config) {
    Object.assign(this, config)
  }

  update(delta) {
    for (let name in this._behaviors) {
      this._behaviors[name].update(delta)
    }
  }


  addBehavior(behavior) {
    behavior = tryToInstantiate(behavior, this.game, this.scene, this)

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

  revive() {}
  kill() {}
  destroy() {}

  getBounds() {}
  hitTest() {}

  isGroup() {}
}
