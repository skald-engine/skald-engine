import Manager from 'core/Manager' 
import Action from 'core/managers/inputs/Action' 
import {INPUT_DEVICES, GAMEPAD_AXIS, KEY, BUTTON, GAMEPAD} from 'core/constants'

/**
 * Handle the time-based information of the engine.
 */
export default class InputsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._actions = null
  }

  setup() {
    this._actions = {}

    this.action('horizontal')
        .add(INPUT_DEVICES.KEYBOARD, KEY.A, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.D, 1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.LEFT, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.RIGHT, 1)
        .add(INPUT_DEVICES.GAMEPAD,  GAMEPAD_AXIS.LEFT_STICK_X, 1, -1)

    this.action('vertical')
        .add(INPUT_DEVICES.KEYBOARD, KEY.W, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.S, 1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.UP, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.DOWN, 1)
        .add(INPUT_DEVICES.GAMEPAD,  GAMEPAD_AXIS.LEFT_STICK_Y, 1)
        
    this.action('shoot')
        .add(INPUT_DEVICES.MOUSE,   BUTTON.LEFT, 1)
        .add(INPUT_DEVICES.GAMEPAD, GAMEPAD.RIGHT_TRIGGER, 1)

    this.action('jump')
        .add(INPUT_DEVICES.KEYBOARD, KEY.SPACE)
        .add(INPUT_DEVICES.GAMEPAD,  GAMEPAD.A)

  }
  
  action(action) {
    if (!this._actions[action]) {
      this._actions[action] = new Action(action, this.game)
    }
    return this._actions[action]
  }
  add(action, device, button, mutiplier, fixed) {
    return this.action(action)
               .add(device, button, multiplier)
  }
  remove(action) {
    delete this._actions[action]
  }
  list(action) {
    if (this._actions[action]) {
      return this._actions[action].list()
    }

    return []
  }
  get(action) {
    if (this._actions[action]) {
      return this._actions[action].get()
    }

    return 0
  }
  clear(action) {
    if (this._actions[action]) {
      this._actions[action].clear()
    }
  }
  forceClear(action) {
    if (this._actions[action]) {
      this._actions[action].forceClear()
    }
  }

}