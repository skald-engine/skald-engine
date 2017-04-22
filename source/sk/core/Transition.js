export default class Transition {
  constructor() {
    this._game = null
    this._swapScenes = false
    this._currentScene = null
    this._nextScene = null
  }

  get game() { return this._game }
  get scene() { return this._scene }
  get swapScenes() { return this._swapScenes }
  set swapScenes(v) { this._swapScenes = !!v }
  
  setup(game, currentScene, nextScene) {
    this._game = game
    this._currentScene = currentScene
    this._nextScene = nextScene
  }

  initialize() {}
  start() {}
  stop() {}
  isFinished() {}
  update(delta) {}
}