
export default class Behavior {
  constructor(game, scene, entity) {
    this._name = name
    this._game = game
    this._scene = scene
    this._entity = entity

    this.initialize()
  }

  get name() { return this._name }
  set name(value) { this._name = value}

  get entity() { return this._entity }
  get scene() { return this._scene }
  get game() { return this._game }

  initialize() {}
  update(delta) {}
}
