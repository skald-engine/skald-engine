import Game from 'core/Game'
import Scene from 'core/Scene'

export default class EventSheet {
  constructor(game, scene) {
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

    this._game = game
    this._scene = scene
    this._events = {}

    this.initialize()
  }

  get game() { return this._game }
  get scene() { return this._scene }

  initialize() {}

  event(eventType, callback) {
    let events = this._events[eventType]
    if (!events) {
      this._events[eventType] = events = []
    }

    events.push(callback)
    this.scene.on(eventType, callback, this)
  }

  leave() {
    let eventTypes = Object.keys(this._events)

    for (let i=0; i<eventTypes.length; i++) {
      let eventType = eventTypes[i]
      let listeners = this._events[eventType]

      for (let j=0; j<listeners.length; j++) {
        this.scene.off(eventType, listeners[j])
      }
    }

    this._events = {}
  }
}