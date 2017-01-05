import AudioSystem from 'core/AudioSystem'
import Audio from 'audio/WebAudioAudio'

export default class WebAudioSystem extends AudioSystem {
  constructor(game) {
    super(game)
    
    this._audioContext = null
    this._masterGain = null

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

  get game() { return this._game }

  static canUse() {
    return !!window.AudioContext || !!window.webkitAudioContext
  }

  createAudio(buffer, data) {
    let audio = new Audio(this, this._masterGain)

    if (typeof data.offset === 'number') audio.offset = data.offset
    if (typeof data.duration === 'number') audio.duration = data.duration
    if (typeof data.volume === 'number') audio.volume = data.volume
    if (typeof data.loop === 'boolean') audio.loop = data.loop
    if (typeof data.allowMultiple === 'boolean') audio.allowMultiple = data.allowMultiple


    if (data.markers) {
      let keys = Object.keys(data.markers)
      for (let i=0; i<keys.length; i++) {
        let key = keys[i]
        let marker = data.markers[key]

        let offset = undefined
        let duration = undefined
        let volume = undefined
        let loop = undefined

        if (typeof marker.offset === 'number') offset = marker.offset
        if (typeof marker.duration === 'number') duration = marker.duration
        if (typeof marker.volume === 'number') volume = marker.volume
        if (typeof marker.loop === 'boolean') loop = marker.loop

        audio.addMarker(key, offset, duration, volume, loop)
      }
    }
    
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