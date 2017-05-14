import Manager from 'sk/core/Manager' 
import EventEmitter from 'sk/core/EventEmitter'
import Event from 'sk/events/Event'
import * as utils from 'sk/utils'

/**
 * This manager handles the game event queue.
 *
 * When you add an event (via `dispatch`), the event will stay at the event 
 * queue until the next update phase. The events will be dispatched and 
 * digested after entities and behaviors update, and before the scene update.
 */
export default class EventsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._eventQueue = []
    this._logEvents = null
    this._usePool = null
  }

  /**
   * Whether the event manager should log the events or not. Default to false.
   * Enable it only for debugging.
   *
   * @type {Boolean}
   */
  get logEvents() { return this._logEvents }
  set logEvents(v) { this._logEvents = !!v }

  /**
   * Whether the event manager should recycle the events or not. It will use 
   * the pool manager for it. Default to true.
   *
   * @type {Boolean}
   */
  get usePool() { return this._usePool }
  set usePool(v) { this._usePool = !!v }

  /**
   * Setup the manager. Called by the engine in the initialization.
   */
  setup() {
    utils.profiling.begin('events')
    this._logEvents = !!this.game.config.events.logEvents
    this._usePool = !!this.game.config.events.usePool
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
      if (this._usePool) {
        let type = event
        event = this.game.pool.create(Event)
        event._type = type
      } else {
        event = new Event(event)
      }
    }

    if (!target) {
      let scene = this.game.scenes.current
      target = scene || this.game
    }

    event.setup(target)
    this._eventQueue.push(event)
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
    let i = this._eventQueue.length;

    // We use WHILE instead of FOR, in order to use poll.shift() function. We 
    // must remove the event from the pool because if there is any error in any
    // listener, the event pool will be stuck forever. 
    while (i > 0) {
      let event = this._eventQueue.shift()  
      let target = event.target

      if (this._logEvents && event.type !== 'update') {
        this.game.log.trace(`(events) Dispatching event "${event.type}".`)
      }

      // Emit on target
      target.emit(event)
      if (event.stopped) continue

      // Emit on scene
      if (target.scene && target.scene.emit) {
        target.scene.emit(event)
        if (event.stopped) continue
      }

      // Emit on game
      if (target.game && target.game.emit) {
        target.game.emit(event)
      }

      // Store the event on the pool, is enabled
      if (this._usePool) {
        event.reset()
        this.game.pool.store(event)
      }

      i--
    }

    this._eventQueue = []
  }
}