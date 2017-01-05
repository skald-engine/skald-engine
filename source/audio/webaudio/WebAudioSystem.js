import AudioSystem from 'core/AudioSystem'
import Audio from 'audio/webaudio/WebAudioAudio'

/**
 * WebAudio audio system. This audio system implements the interface to the 
 * browser WebAudio API, which is supported by most current browsers (see 
 * http://caniuse.com/#feat=audio-api).
 *
 * This system creates {@link WebAudioAudio} objects to represent the audio 
 * files.
 */
export default class WebAudioSystem extends AudioSystem {

  /**
   * @param {Game} game - The game instance
   */
  constructor(game) {
    super(game)
    
    this._audioContext = null
    this._masterGain = null

    if (!WebAudioSystem.canUse()) {
      throw new Error(`Trying to use web audio system in a platform that `+ 
                      `does not support it.`)
    }

    // Creates the audio context
    this._audioContext = this._createAudioContext()

    // Creates the gain node for master volume
    this._masterGain = this.createGainNode()
    this._masterGain.gain.value = 1
    this._masterGain.connect(this._audioContext.destination)
  }

  /**
   * Verifies if browser supports the webaudio api.
   *
   * @return {Boolean}
   */
  static canUse() {
    return !!window.AudioContext || !!window.webkitAudioContext
  }

  /**
   * Creates an audio given a buffer and a metadata object.
   *
   * @param {Object} buffer - The buffer object.
   * @param {Object} data - The audio metadata.
   * @return {WebAudioAudio} The audio object.
   */
  createAudio(buffer, data) {
    let audio = new Audio(this, this._masterGain)

    data = data || {}
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

  /**
   * Creates a new webaudio context.
   *
   * @return {AudioContext}
   */
  _createAudioContext() {
    if (window.AudioContext) {
      return new window.AudioContext()
    } else {
      return new window.webkitAudioContext()
    }
  }

  /**
   * Creates a webaudio gain node.
   *
   * @return {GainNode}
   */
  createGainNode() {
    if (this._audioContext.createGainNode) {
      return this._audioContext.createGainNode()
    } else {
      return this._audioContext.createGain()
    }
  }
}