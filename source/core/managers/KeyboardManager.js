import Manager from 'core/Manager' 
import KeyboardEvent from 'core/events/KeyboardEvent'

/**
 * This manager handle the keyboard state. It is created by the game and can be
 * accessed via `game.keyboard`.
 */
export default class KeyboardManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._lastState       = []
    this._state           = []
    this._preventDefaults = null
    this._allowEvents     = null
  }

  get preventDefaults() { return this._preventDefaults }
  set preventDefaults(value) { this._preventDefaults = !!value}

  get allowEvents() { return this._allowEvents }
  set allowEvents(value) { this._allowEvents = !!value}

  
  setup() {
    this._setupConfig()
    this._setupEvents()
  }

  postUpdate(delta) {
    this._lastState = this._state.slice()
  }

  isDown(key) {
    return this._state.indexOf(key) >= 0
  }

  isUp(key) {
    return this._state.indexOf(key) < 0
  }

  isPressed(key) {
    return this._state.indexOf(key) >= 0 &&
           this._lastState.indexOf(key) < 0
  }

  isReleased(key) {
    return this._state.indexOf(key) < 0 &&
           this._lastState.indexOf(key) >= 0
  }

  isAnyDown(key) {
    return !!this._state.length 
  }

  isAnyPressed(key) {
    for (let i=0; i<this._state.length; i++) {
      let key = this._state[i];
      if (this._lastState.indexOf(key) < 0) return true
    }
  
    return false
  }

  isAnyReleased(key) {
    for (let i=0; i<this._lastState.length; i++) {
      let key = this._lastState[i];
      if (this._state.indexOf(key) < 0) return true
    }

    return false
  }


  _setupConfig() {
    let config = this.game.config
    this._preventDefaults = config.keyboard.preventDefaults
    this._allowEvents     = config.keyboard.allowEvents
  }

  _setupEvents() {
    let view = this.game.renderer.view
    view.addEventListener('blur', e=>this._onBlur(e), false)
    view.addEventListener('focus', e=>this._onFocus(e), false)
    view.addEventListener('keydown', e=>this._onKeyDown(e), false)
    view.addEventListener('keypress', e=>this._onKeyPress(e), false)
    view.addEventListener('keyup', e=>this._onKeyUp(e), false)
  }

  _dispatchEvent(type, event) {
    if (!this._allowEvents) return

    this.game.events.dispatch(new KeyboardEvent(
      type,
      event.keyCode||event.which,
      event.shiftKey,
      event.ctrlKey,
      event.metaKey,
      event.altKey,
      event
    ))
  }

  _onBlur(event) {
    this._state = []
  }
  _onFocus(event) {
  }
  _onKeyDown(event) {
    // Pressing key the first time
    if (!event.repeat) {
      this._state.push(event.keyCode||event.which)
      this._dispatchEvent('keydown', event)

    // Holding key
    } else {
      this._dispatchEvent('keyhold', event)
    }

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }
  _onKeyPress(event) {
    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }
  _onKeyUp(event) {
    this._state.splice(this._state.indexOf(event.keyCode||event.which), 1)
    this._dispatchEvent('keyup', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }
}