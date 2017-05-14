import Manager from 'sk/core/Manager' 
import Touch from 'sk/core/Touch'
import TouchEvent from 'sk/events/TouchEvent'
import * as utils from 'sk/utils'

/**
 * This manager is responsible for handling the browser touch events. It is
 * created by the engine and can be accessed using `game.touches`.
 *
 * The TouchManager stores 10 `Touch` objects and update them using the browser
 * events.
 */
export default class TouchesManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._preventDefaults = null
    this._allowEvents     = null
    this._touches         = null
    this._numTouches      = 0
  }

  /**
   * Whether this manager should prevent the default mouse event behavior or
   * not.
   * @type {Boolean}
   */
  get preventDefaults() { return this._preventDefaults }
  set preventDefaults(value) { this._preventDefaults = !!value}

  /**
   * Whether this manager should dispatch events or not.
   * @type {Boolean}
   */
  get allowEvents() { return this._allowEvents }
  set allowEvents(value) { this._allowEvents = !!value}

  /**
   * Setup the this manager. Called by the engine, do not call it manually.
   */
  setup() {
    utils.profiling.begin('touches')
    this._setupConfig()
    this._setupEvents()
    this._setupTouches()
    utils.profiling.end('touches')
  }

  /**
   * Setup the manager variables using the game configuration.
   */
  _setupConfig() {
    let config = this.game.config
    this._preventDefaults = config.mouse.preventDefaults
    this._allowEvents     = config.mouse.allowEvents
  }

  /**
   * Setup the touch-related events.
   */
  _setupEvents() {
    let view = this.game.renderer.view
    view.addEventListener('blur', e=>this._onBlur(e), false);
    view.addEventListener('touchstart', e=>this._onTouchStart(e), false);
    view.addEventListener('touchmove', e=>this._onTouchMove(e), false);
    view.addEventListener('touchend', e=>this._onTouchEnd(e), false);
    view.addEventListener('touchcancel', e=>this._onTouchCancel(e), false);
  }

  /**
   * Setup up the touch objects.
   */
  _setupTouches() {
    this._touches = [
      new Touch(0, this.game),
      new Touch(1, this.game),
      new Touch(2, this.game),
      new Touch(3, this.game),
      new Touch(4, this.game),
      new Touch(5, this.game),
      new Touch(6, this.game),
      new Touch(7, this.game),
      new Touch(8, this.game),
      new Touch(9, this.game)
    ]
  }

  /**
   * Handles canvas blur event.
   *
   * @param {Event} event - The browser event.
   */
  _onBlur(event) {
    this._numTouches = 0

    for (let i=0; i<this._touches.length; i++) {
      this._touches[i].unbind()
    }
  }

  /**
   * Handles touch start event.
   *
   * @param {Event} nativeEvent - The browser event.
   */
  _onTouchStart(nativeEvent) {
    for (let i=0; i<nativeEvent.changedTouches.length; i++) {
      let browserTouch = nativeEvent.changedTouches[i]
      let id = browserTouch.identifier

      for (let j=0; j<this._touches.length; j++) {
        let skaldTouch = this._touches[j]

        if (!skaldTouch.down || skaldTouch.id === id) {
          skaldTouch.bind(browserTouch)
          this._numTouches++

          // Dispatch event to game
          let event = this.game.pool.create(TouchEvent)
          event._type = 'touches.down'
          event._index = j
          event._x = skaldTouch.x
          event._y = skaldTouch.y
          event._nativeEvent = nativeEvent
          this.game.events.dispatch(event)

          break
        }
      }
    }

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Handles touch move event.
   *
   * @param {Event} nativeEvent - The browser event.
   */
  _onTouchMove(nativeEvent) {
    for (let i=0; i<nativeEvent.changedTouches.length; i++) {
      let browserTouch = nativeEvent.changedTouches[i]
      let id = browserTouch.identifier

      for (let j=0; j<this._touches.length; j++) {
        let skaldTouch = this._touches[j]

        if (skaldTouch.id === id) {
          skaldTouch.notify(browserTouch)

          // Dispatch event to game
          let event = this.game.pool.create(TouchEvent)
          event._type = 'touches.move'
          event._index = j
          event._x = skaldTouch.x
          event._y = skaldTouch.y
          event._nativeEvent = nativeEvent
          this.game.events.dispatch(event)

          break
        }
      }
    }

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Handles touch end event.
   *
   * @param {Event} nativeEvent - The browser event.
   */
  _onTouchEnd(nativeEvent) {
    for (let i=0; i<nativeEvent.changedTouches.length; i++) {
      let browserTouch = nativeEvent.changedTouches[i]
      let id = browserTouch.identifier

      for (let j=0; j<this._touches.length; j++) {
        let skaldTouch = this._touches[j]

        if (skaldTouch.id === id) {
          skaldTouch.unbind(browserTouch)
          this._numTouches--

          // Dispatch event to game
          let event = this.game.pool.create(TouchEvent)
          event._type = 'touches.up'
          event._index = j
          event._x = skaldTouch.x
          event._y = skaldTouch.y
          event._nativeEvent = nativeEvent
          this.game.events.dispatch(event)

          break
        }
      }
    }

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Handles touch cancel event.
   *
   * @param {Event} nativeEvent - The browser event.
   */
  _onTouchCancel(nativeEvent) {
    this._numTouches = 0

    for (let i=0; i<this._touches.length; i++) {
      this._touches[i].unbind()

      // Dispatch event to game
      let event = this.game.pool.create(TouchEvent)
      event._type = 'touches.up'
      event._index = j
      event._x = skaldTouch.x
      event._y = skaldTouch.y
      event._nativeEvent = nativeEvent
      this.game.events.dispatch(event)
    }

    if (this._preventDefaults) {
      return false
    }
  }

  /**
   * Get a touch by its index.
   *
   * @param {Number} index - The touch id, should be 0-9.
   * @return {Touch} The touch object.
   */
  get(index) {
    return this._touches[index]
  }

  /**
   * Get the first touch down object.
   *
   * @return {Touch} The touch object.
   */
  getFirstTouch() {
    for (let i=0; i<this._touches.length; i++) {
      if (this._touches[i].down) {
        return this._touches[i]
      }
    }
  }

  /**
   * Get the number of touches in the screen.
   *
   * @return {Number} Number of touches down.
   */
  getNumTouches() {
    return this._numTouches
  }

  /**
   * Get all touch down.
   *
   * @return {Array<Touch>} The list of touches.
   */
  getDownTouches() {
    return this._touches.filter(t => t.down)
  }

  /**
   * Get all touches.
   *
   * @return {Array<Touch>} The list of all touches.
   */
  getAll() {
    return this._touches.slice()
  }

  /**
   * 
   */
  getInput() {
    return 0
  }
}