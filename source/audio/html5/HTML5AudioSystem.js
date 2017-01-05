import AudioSystem from 'core/AudioSystem'

export default class HTML5AudioSystem extends AudioSystem {
  constructor(game) {
    super()
    
    this._game = game
  }

  get game() { return this._game }
}