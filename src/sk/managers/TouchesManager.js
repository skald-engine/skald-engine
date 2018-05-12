const $ = require('sk/$')
const C = require('sk/constants')
const Touch = require('sk/core/Touch')
const Manager = require('sk/core/Manager')
const signals = require('sk/signals')

/**
 * This manager is responsible for handling the browser touch events. It is
 * created by the engine and can be accessed using `game.touches`.
 *
 * The TouchManager stores 10 `Touch` objects and update them using the browser
 * events.
 */
class TouchesManager extends Manager {
  constructor() {
    super()

    this._preventDefaults = null
    this._touches         = null
    this._numTouches      = 0

    this._profile = null
    this._config = null
    this._renderer = null

    this._touchDownSignal = null
    this._touchMoveSignal = null
    this._touchUpSignal = null
  }

  /**
   * Whether this manager should prevent the default mouse event behavior or
   * not.
   * @type {Boolean}
   */
  get preventDefaults() { return this._preventDefaults }
  set preventDefaults(value) { this._preventDefaults = !!value}

  get numTouches() { return this._numTouches }

  /**
   * Setup the this manager. Called by the engine, do not call it manually.
   */
  setup() {
    let injector = $.getInjector()
    this._profile = injector.resolve('profile')
    this._config = injector.resolve('config')
    this._renderer = injector.resolve('renderer')

    this._touchDownSignal = injector.resolve('touchDownSignal')
    this._touchMoveSignal = injector.resolve('touchMoveSignal')
    this._touchUpSignal = injector.resolve('touchUpSignal')

    this._profile.begin('touches')
    this._setupConfig()
    this._setupEvents()
    this._setupTouches()
    this._profile.end('touches')
  }

  /**
   * Setup the manager variables using the game configuration.
   */
  _setupConfig() {
    this._preventDefaults = this._config.get('touches.prevent_defaults')
  }

  /**
   * Setup the touch-related events.
   */
  _setupEvents() {
    let view = this._renderer.view
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
    this._touches = []
    for (let i=0; i<10; i++) {
      let touch = new Touch(0)
      touch.setup()
      this._touches.push(touch)
    }
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
        let touch = this._touches[j]

        if (!touch.down || touch.id === id) {
          touch.bind(browserTouch)
          this._numTouches++
          this._touchDownSignal.dispatch(j, touch.x, touch.y, nativeEvent)
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
        let touch = this._touches[j]

        if (touch.id === id) {
          touch.notify(browserTouch)
          this._touchMoveSignal.dispatch(j, touch.x, touch.y, nativeEvent)
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
        let touch = this._touches[j]

        if (touch.id === id) {
          touch.unbind(browserTouch)
          this._numTouches--
          this._touchUpSignal.dispatch(j, touch.x, touch.y, nativeEvent)
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
      let touch = this._touches[i]
      this._touchUpSignal.dispatch(i, touch.x, touch.y, nativeEvent)
      touch.unbind()
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
  getFirst() {
    for (let i=0; i<this._touches.length; i++) {
      if (this._touches[i].down) {
        return this._touches[i]
      }
    }
  }

  /**
   * Get all touch down.
   *
   * @return {Array<Touch>} The list of touches.
   */
  getLiveTouches() {
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
}

module.exports = TouchesManager