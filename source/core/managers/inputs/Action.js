export default class Action {
  constructor(name, game) {
    this._name = name
    this._game = game
    this._resultMode = null

    this._commands = []
  }

  add(device, button, multiplier, fixed) {}
  list() {}
  get() {}
  clear() {}
  forceClear() {}
}