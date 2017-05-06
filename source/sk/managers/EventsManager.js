import Manager from 'sk/core/Manager' 
import EventEmitter from 'sk/core/EventEmitter'
import Event from 'sk/events/Event'
import * as utils from 'sk/utils'

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
    this._showLog = false
  }

  setup() {
    utils.profiling.begin('events')
    this._showLog = !!this.game.config.events.logEvents
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
    if (typeof event !== 'string' && !(event instanceof Event)) {
      throw new Error(`Event must be an instance of skald.events.Event class.`)
    }

    if (target && !(target instanceof EventEmitter)) {
      throw new Error(`Target must be an instance of skald.EventEmitter.`)
    }

    if (typeof event === 'string') {
      event = new Event(event)
    }

    if (!target) {
      let scene = this.game.scenes.current
      target = scene || this.game
    }

    event.setup(target)

    this._eventPool.push(event)
  }

  /**
   * Dispatch all events in the pool. Called automatically by the engine, do 
   * not call it manually.
   *
   * @param {Number} delta
   */
  update(delta) {
    // We must freeze the number of events that will be digested because other
    // events may be added during the digest phase, thus, with the risk of 
    // happening an infinite list of events. For this reason, any event added
    // during the digest phase, will only be digested in the next cycle.
    let i = this._eventPool.length;

    // We use WHILE instead of FOR, in order to use poll.shift() function. We 
    // must remove the event from the pool because if there is any error in any
    // listener, the event pool will be stuck forever. 
    while (i > 0) {
      let event = this._eventPool.shift()  
      let target = event.target

      if (this._showLog && event.type !== 'update') {
        this.game.log.trace(`(events) Dispatching event "${event.type}".`)
      }

      target.emit(event)
      if (event.stopped) continue

      if (target.scene && target.scene.emit) {
        target.scene.emit(event)
        if (event.stopped) continue
      }

      if (target.game && target.game.emit) {
        target.game.emit(event)
      }

      i--
    }

    this._eventPool = []
  }
}