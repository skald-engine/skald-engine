export default class AudioSystem {
  constructor(game, suppressInitialize=false) {
    this._game = game

    if (!suppressInitialize) {
      this.initialize() 
    }
  }

  initialize() {}

  configure(config) {
    Object.assign(this, config)
  }
}