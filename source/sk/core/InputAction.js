import {INPUT_DEVICES, GAMEPAD_AXIS, KEY, BUTTON, GAMEPAD} from 'sk/constants'


/**
 * This class represents an action for the inputs manager. Action objects are
 * created by the inputs manager, and you don't need to use them manually.
 * 
 * It holds a list of commands (pair of <device, button>).
 */
export default class Action {
  /**
   * @param {String} name - The name of this action.
   * @param {Game} game - The game instance.
   */
  constructor(name, game) {
    this._name = name
    this._game = game

    this._deviceMap = {
      [INPUT_DEVICES.KEYBOARD] : this.game.keyboard,
      [INPUT_DEVICES.MOUSE]    : this.game.mouse,
      [INPUT_DEVICES.GAMEPAD]  : this.game.gamepads,
      [INPUT_DEVICES.TOUCH]    : this.game.touches,
    }

    this._commands = []
  }

  /**
   * The game instance.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The name of this action.
   * @type {String}
   */
  get name() { return this._name }

  /**
   * Adds a new command to this action. 
   *
   * A command is composed by a `device` (from {@link skald.INPUT_DEVICES}
   * constants), a `button` (from {@link skald.KEY}, {@link skald.BUTTON},
   * {@link skald.GAMEPAD}, or {@link skald.GAMEPAD_AXIS}), and a multiplier
   * (numeric value).
   *
   * When you use the `get` method, it will return a numeric value (from the
   * specific managers, such as keyboard and mouse) multiplied by the 
   * `multiplier` parameter.
   * 
   * Notice that it does not verifies for duplicated entries.
   *
   * @param {INPUT_DEVICES} device - The device.
   * @param {KEY|BUTTON|GAMEPAD|GAMEPAD_AXIS} button - The command button or key.
   * @param {Number} [multiplier=1] - The numeric multiplier.
   * @return {Action} This own object.
   */
  add(device, button, multiplier=1) {
    if (!INPUT_DEVICES(device)) {
      throw new TypeError(`Invalid input device "${device}".`)
    }

    if (device === INPUT_DEVICES.KEYBOARD && !KEY(button) ||
        device === INPUT_DEVICES.MOUSE && !BUTTON(button) ||
        device === INPUT_DEVICES.GAMEPAD && !(GAMEPAD(button) || GAMEPAD_AXIS(button))) {
      throw new TypeError(`Invalid input button "${button}."`)
    }

    this._commands.push({
      device     : device,
      button     : button,
      multiplier : multiplier
    })

    return this
  }

  /**
   * Returns a list with the commands registered in this action. It uses the 
   * format:
   *
   *     [{device:<>, button:<>, multiplier:<>}, ....]
   *
   * @return {Array} List of commands.
   */
  list() {
    return this._commands.map(x=>{
      return {
        device     : x.device,
        button     : x.button,
        multiplier : x.multiplier
      }
    })
  }

  /**
   * Return the input state from all commands registered in this action. It 
   * will verify all commands, returning the first non-zero value multiplied by
   * its `multiplier` constant.
   *
   * @return {Number} The input state.
   */
  get() {
    for (let i=0; i<this._commands.length; i++) {
      let command = this._commands[i]
      let manager = this._deviceMap[command.device]
      let result = manager.getInput(command.button)

      if (result) {
        return result*command.multiplier
      }
    }

    return 0
  }

  /**
   * Remove all commands from this action.
   */
  clear() {
    this._commands = []
  }
}