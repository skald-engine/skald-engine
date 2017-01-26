import Game from 'core/Game'
import Scene from 'core/Scene'


/**
 * An event sheet is an utility class that provides a structured way to 
 * represent the game logic (the business rules of the game). 
 *
 * The EventSheet works by providing a direct interface to the scene events, 
 * thus, all game logic you add in an event sheet will be treated in the event
 * system.
 *
 * You may have several independent event sheets in your game and even reuse 
 * sheets in different scenes.
 *
 * Example usage:
 *
 *     class MyEvents extends skald.EventSheet {
 *       initialize() {
 *         // run on scene update
 *         this.event('update', function() {
 *           ... update code ...
 *         })
 *
 *         // called when `custom-event` is triggered on scene
 *         this.event('custom-event', function() {
 *           ...
 *         })
 *       }
 *     }
 * 
 */
export default class EventSheet {

  /**
   * @param {Game} game - The game instance.
   * @param {Scene} scene - The scene in which this event will be attached.
   */
  constructor(game, scene) {
    if (!game || !(game instanceof Game)) {
      throw new TypeError(
        `Trying to instantiate a Game without an instance of sk.Game.`
      )
    }

    if (!scene || !(scene instanceof Scene)) {
      throw new TypeError(
        `Trying to instantiate a Scene without an instance of sk.Scene.`
      )
    }

    this._game = game
    this._scene = scene
    this._events = {}

    this.initialize()
  }

  /**
   * The game instance.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The scene in which this event sheet is attached.
   * @type {Scene}
   */
  get scene() { return this._scene }

  /**
   * The initialization method of this class, override this to put your 
   * initialization code.
   */
  initialize() {}

  /**
   * Sets a batch of variables.
   *
   * @param {Object} config - A dict with variables and values to be set in 
   *        this sheet.
   */
  configure(config) {
    Object.assign(this, config)
    return this
  }
  
  /**
   * Create an event rule. The event will be attached on the scene and be 
   * called every time this event type is triggered in scene.
   *
   * @param {String} eventType - The type of event to be listened.
   * @param {Function} listener - The callback function.
   */
  event(eventType, listener) {
    let events = this._events[eventType]
    if (!events) {
      this._events[eventType] = events = []
    }

    events.push(listener)
    this.scene.on(eventType, listener, this)
  }

  /**
   * Called automatically by the engine when the event sheet is removed from 
   * the scene. Do not call it manually.
   */
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