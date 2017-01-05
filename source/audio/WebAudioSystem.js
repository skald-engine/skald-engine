import AudioSystem from 'core/AudioSystem'
import Audio from 'audio/WebAudioAudio'

export default class WebAudioSystem extends AudioSystem {
  constructor(game) {
    super(game, true)
    
    this._audioContext = null
    this._masterGain = null

    this.initialize()
  }

  get game() { return this._game }

  static canUse() {
    return !!window.AudioContext || !!window.webkitAudioContext
  }

  initialize() {
    if (!WebAudioSystem.canUse()) {
      throw new Error(`Trying to use web audio system in a platform that `+ 
                      `does not support it.`)
    }

    // Creates the audio context
    this._audioContext = this._getAudioContext()

    // Creates the gain node for master volume
    this._masterGain = this.createGainNode()
    this._masterGain.gain.value = 1
    this._masterGain.connect(this._audioContext.destination)
  }

  createAudio(buffer) {
    let audio = new Audio(this, this._masterGain)
    
    this._audioContext.decodeAudioData(buffer, function(buffer) {
      audio.buffer = buffer
    })

    return audio
  }

  _getAudioContext() {
    if (window.AudioContext) {
      return new window.AudioContext()
    } else {
      return new window.webkitAudioContext()
    }
  }

  createGainNode() {
    if (this._audioContext.createGainNode) {
      return this._audioContext.createGainNode()
    } else {
      return this._audioContext.createGain()
    }
  }
}