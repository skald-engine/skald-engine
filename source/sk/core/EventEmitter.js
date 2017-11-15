/**
 * The EventEmitter uses a interface similar to the `eventemitter3` library, 
 * used internally by Pixi.js, so we can keep compatibility with pixi.js stuff 
 * and be able to handle with interaction events of pixi display objects. 
 * However, we convert the pixi events to Skald events.
 *
 * Notice that, EventEmitter is a mixin class, so you must use it like:
 *
 *     class MyClass extends EventEmitter() {}
 * 
 * References:
 *
 * - [Pixi interaction events](http://pixijs.download/release/docs/PIXI.interaction.InteractionManager.html)
 * - [Eventemitter3](https://github.com/primus/eventemitter3/)
 */
class EventEmitter {
  constructor() {
    this._listeners = {}
  }

  /**
   * Returns a list of events registered in this objects. Notice that, only
   * events with listeners are listed.
   *
   * @return {Array<String>} List of event types
   */
  getEventNames() {
    return Object.keys(this._listeners)
  }

  /**
   * Returns all listeners registered for a given event.
   *
   * @param {String} eventType - The type of the event.
   * @param {Boolean} [exists=false] - If true, just checks if there is events,
   *        thus, returning a boolean.
   * @return {Array<Function>|Boolean} An array of listener functions or a 
   *         boolean if the exists is set to true
   */
  getEventListeners(eventType, exists=false) {
    let listeners = this._listeners[eventType]

    if (exists) {
      return !!listeners
    } else {
      return (listeners||[]).slice() // copy the list
    }
  }

  /**
   * Emit the event object to this object. The event will not bubble (i.e., the
   * event will be digested only by this object) if you call this method 
   * manually. If you want to dispatch an event that bubbles through the game
   * hierarchy (e.g., entity -> scene -> game), use 
   * {@link EventsManager.addEvent} at `game.events` manager.
   *
   * @param {Event} event - The event object.
   */
  dispatch(event) {
    let listeners = this._listeners[event.type]
    if (listeners) {
      for (let i=0; i<listeners.length; i++) {
        if (event.immediateStopped) return

        let e = listeners[i]
        Reflect.apply(e.listener, e.context, [event])
      }
    }
  }

  /**
   * Adds a listener function to an event. You may also use `on` as an alias
   * to this method.
   *
   * @param {String} eventType - The type of the event to listen.
   * @param {Function} listener - The callback function.
   * @param {Object} context - The context (i.e., the object attached to 
   *        `this`) of the callback.
   */
  addEventListener(eventType, listener, context) {
    let events = this._listeners[eventType]
    if (!events) {
      this._listeners[eventType] = events = []
    }

    events.push({listener, context})
  }

  /**
   * Remove an event listener. You may use `off` method as alias to this.
   *
   * @param {String} eventType - The type of the event.
   * @param {Function} listener - The function to be removed.
   */
  removeEventListener(eventType, listener) {
    let events = this._listeners[eventType]
    if (!events) return

    let i = events.findIndex(e => e.listener === listener)
    if (i < 0) return

    events.splice(i, 1)
    if (events.length === 0) {
      delete this._listeners[eventType]
    }
  }

  /**
   * Remove all listeners to an event.
   *
   * @param {String} eventType - The type of the event.
   */
  removeAllEventListeners(eventType) {
    delete this._listeners[eventType]
  }

  /**
   * Immediate emit the event, called internally by the engine. Do not call it
   * manually.
   */
  _immediateEmit(event) {
    let listeners = this._listeners[event.type]
    if (listeners) {
      for (var i=0; i<listeners.length; i++) {
        if (event.immediateStopped) return

        let e = listeners[i]
        Reflect.apply(e.listener, e.context, [event])
      }
    }
  }
}


module.exports = EventEmitter