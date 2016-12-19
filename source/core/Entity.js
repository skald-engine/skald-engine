import EventEmitter from 'core/EventEmitter'

/**
 * @ignore
 */
export default function Entity(baseclass) {

  /**
   * 
   */
  return class Entity extends EventEmitter(baseclass) {
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

    addBehavior(behavior) {}
    removeBehavior(behaviorOrName) {}
    hasBehavior(behaviorName) {}
  }

}