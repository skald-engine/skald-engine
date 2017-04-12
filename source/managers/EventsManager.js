import Manager from 'core/Manager' 
// import Event from 'core/events/Event'
import EventEmitter from 'core/EventEmitter'
import * as utils from 'utils'

/**
 * This manager handles the game event pool.
 *
 * When you add an event (via `dispatch`), the event will stay at the event 
 * pool until the next update phase. The events will be dispatched and digested
 * after entities and behaviors update, and before the scene update.
 */
export default class EventsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._eventPool = []
  }

  setup() {
    utils.profiling.begin('events')
    utils.profiling.end('events')
  }
  
  /**
   * Adds a new event to the event pool.
   *
   * You may provide and {@link Event} object or a string. If you provide a
   * string, this method will create the Event object internally.
   *
   * By default the event will have the current scene as target. If there is no
   * scene currently active on director, the game will be the target. However,
   * you may provide a target to override this behavior.
   *
   * @param {Event|String} event - The event type or an Event object.
   * @param {EventEmitter} [target] - The event target.
   */
  dispatch(event, target) {
    // if (typeof event !== 'string' && !(event instanceof Event)) {
    //   throw new Error(`Event must be an instance of skald.events.Event class.`)
    // }

    // if (target && !(target instanceof EventEmitter)) {
    //   throw new Error(`Target must be an instance of skald.EventEmitter.`)
    // }

    // if (typeof event === 'string') {
    //   event = new Event(event)
    // }

    // if (!target) {
    //   let scene = this.game.director.currentScene
    //   target = scene || this.game
    // }

    // event.setup(target)

    // this._eventPool.push(event)
  }

  /**
   * Dispatch all events in the pool. Called automatically by the engine, do 
   * not call it manually.
   *
   * @param {Number} delta
   */
  update(delta) {
    // for (var i=0; i<this._eventPool.length; i++) {
    //   let event = this._eventPool[i]

    //   let target = event.target

    //   target.emit(event)
    //   if (event.stopped) continue

    //   if (target.scene && target.scene.emit) {
    //     target.scene.emit(event)
    //     if (event.stopped) continue
    //   }

    //   if (target.game && target.game.emit) {
    //     target.game.emit(event)
    //   }
    // }

    // this._eventPool = []
  }
}