

export default class Behavior {
  constructor() {
    this._name = null
    this._entity = null
  }

  get name() { return this._name }
  get entity() { return this._entity }
  get scene() {
    let entity = this._entity
    return entity && entity.scene
  }
  get game() {
    let entity = this._entity
    let scene = entity && entity.scene
    return scene && scene.game
  }

  setup(entity) {
    this._entity = entity
  }

  // ?
  update(delta) {}
  processEntity() {}
  processGroup() {}
}
