import Manager from 'core/Manager' 
import Gamepad from 'core/managers/inputs/Gamepad'
import GamepadEvent from 'core/events/GamepadEvent'

export default class GamepadsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._preventDefaults = null
    this._allowEvents     = null
    this._gamepads        = null
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
    this._setupConfig()
    this._setupGamepads()
    this._setupEvents()
  }

  /**
   * Pre update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  preUpdate(delta) {
    // call get gamepads every tick to force browser to get the updated values
    this._getGamepads()

    this._gamepads[0].preUpdate(delta)
    this._gamepads[1].preUpdate(delta)
    this._gamepads[2].preUpdate(delta)
    this._gamepads[3].preUpdate(delta)
  }

  /**
   * Post update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate(delta) {
    this._gamepads[0].postUpdate(delta)
    this._gamepads[1].postUpdate(delta)
    this._gamepads[2].postUpdate(delta)
    this._gamepads[3].postUpdate(delta)
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
   * Setup the gamepads objects.
   */
  _setupGamepads() {
    this._gamepads = [
      new Gamepad(0, this.game),
      new Gamepad(1, this.game),
      new Gamepad(2, this.game),
      new Gamepad(3, this.game)
    ]

    let gamepads = this._getGamepads()
    for (let i=0; i<gamepads.length; i++) {
      if (gamepads[i]) {
        this._onGamepadConnected({gamepad:gamepads[i]})
      }
    }
  }

  /**
   * Setup the events on the canvas.
   */
  _setupEvents() {
    window.addEventListener('gamepadconnected', e=>this._onGamepadConnected(e), false)
    window.addEventListener('gamepaddisconnected', e=>this._onGamepadDisonnected(e), false)
  }

  /**
   * Dispatch a browser gamepad event to the game.
   *
   * @param {String} eventType - The type of the event.
   * @param {Event} event - The browser event.
   */
  _dispatchEvent(eventType, event, gamepad) {
    if (!this._allowEvents) return

    this.game.events.dispatch(new GamepadEvent(
      eventType,
      gamepad,
      event
    ))
  }

  /**
   * Callback for the gamepad connected.
   *
   * @param {Event} event - The browser event.
   */
  _onGamepadConnected(event) {
    let gamepad = this._gamepads[event.gamepad.index]
    if (!gamepad.connected) {
      gamepad.bind(event.gamepad)
      this._dispatchEvent('gamepadconnected', event, gamepad)
      return
    }
  }

  /**
   * Callback for the gamepad disconnected.
   *
   * @param {Event} event - The browser event.
   */
  _onGamepadDisonnected(event) {
    let gamepad = this._gamepads[event.gamepad.index]
    if (gamepad.isBoundedTo(event.gamepad)) {
      gamepad.unbind()
      this._dispatchEvent('gamepaddisconnected', event, gamepad)
      return
    }
  }

  _getGamepads() {
    return navigator.getGamepads && navigator.getGamepads() ||
           navigator.webkitGetGamepads && navigator.webkitGetGamepads() ||
           navigator.msGetGamepads && navigator.msGetGamepads() ||
           navigator.webkitGamepads && navigator.webkitGamepads() ||
           []
  }

  get(i) {
    return this._gamepads[i]
  }
  getNumGamepads() {
    let n=0
    for (let i=0; i<this._gamepads.lenght; i++) {
      if (this._gamepads[i].connected) {
        n++
      }
    }

    return n
  }
  getConnectedGamepads() {
    return this._gamepads.filter(g => g.connected)
  }
}