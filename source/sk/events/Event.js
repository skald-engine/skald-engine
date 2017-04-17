/**
 * Base event class.
 * 
 * This class is used as base for all events in Skald engine. It tries to keep
 * a compatibility with the browser native event.
 */
export default class Event {
  
  /**
   * @param {String} type - The name of the event.
   * @param {Boolean} [cancelable=true] - Whether if this event may be canceled
   *        from bubbling or not.
   */
  constructor(type, cancelable=true) {
    this._target = null
    this._type = type
    this._cancelable = cancelable
    this._stopped = false
    this._immediateStopped = false
  }

  /**
   * Target object of the element. Readonly.
   * @type {Object}
   */
  get target() { return this._target }

  /**
   * Type (or name) of the event. Readonly.
   * @type {String}
   */
  get type() { return this._type }

  /**
   * Whether this event can be cancelled (from bubbling) or not. Readonly.
   * @type {Boolean}
   */
  get cancelable() { return this._cancelable }

  /**
   * Whether this event bubbles (propagate through the game hierarchy) or not.
   * Readonly.
   * @type {Boolean}
   */
  get bubbles() { return this._bubbles }

  /**
   * Whether this event was stopped from bubbling or not. Readonly.
   * @type {Boolean}
   */
  get stopped() { return this._stopped }

  /**
   * Whether this event was stopped from bubbling or not. The difference 
   * between this and `stopped` is that, `stopped` stops the bubbling 
   * (propagation through the game hierarchy) while `immediateStopped` stops 
   * the propagation even for the same level of hierarchy (i.e., the listener
   * the immediate stopped this event will be last listener to receive the 
   * event). Readonly
   * @type {Boolean}
   */
  get immediateStopped() { return this._immediateStopped }


  /**
   * Initializes the event. Called internally by the engine, thus, do not call
   * this method manually.
   */
  setup(target) {
    this._target = target
  }

  /**
   * Stops the event. I.e., the event won't bubble (propagate through the game
   * hierarchy). Notice that, other listeners at the same level may still 
   * receive this event.
   */
  stopPropagation() {
    if (this._cancelable)
      this._stopped = true
  }

  /**
   * Stops the event - i.e., the event won't bubble (propagate through the game
   * hierarchy) - and also stops all following listeners at the same level from
   * receiving this event.
   */
  stopImmediatePropagation() {
    if (this._cancelable)
      this._stopped = true
      this._immediateStopped = true
  }
}