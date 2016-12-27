import {INPUT_DEVICES, GAMEPAD_AXIS, KEY, BUTTON, GAMEPAD} from 'core/constants'

export default class Action {
  constructor(name, game) {
    this._name = name
    this._game = game
    this._resultMode = null

    this._deviceMap = {
      [INPUT_DEVICES.KEYBOARD] : this.game.keyboard,
      [INPUT_DEVICES.MOUSE]    : this.game.mouse,
      [INPUT_DEVICES.GAMEPAD]  : this.game.gamepads,
      [INPUT_DEVICES.TOUCH]    : this.game.touches,
    }

    this._commands = []
  }

  get game() { return this._game }
  get name() { return this._name }

  add(device, button, multiplier=1, fixed=false) {
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
      multiplier : multiplier,
      fixed      : fixed,
    })

    return this
  }

  list() {
    return this._commands.map(x=>[x.device, x.button, x.multiplier, x.fixed])
  }
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
  clear() {
    this._commands = []
  }
  forceClear() {
    this._commands = []
  }
}