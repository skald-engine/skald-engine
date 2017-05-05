import AudioSystem from 'sk/core/AudioSystem'
import Audio from 'sk/audio/webaudio/WebAudioAudio'

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
    
    this._type = 'webaudio'
    this._audioContext = null
    this._masterGain = null
    this._scratchBuffer = null

    if (!WebAudioSystem.canUse()) {
      throw new Error(`Trying to use web audio system in a platform that `+ 
                      `does not support it.`)
    }

    this._initialize()
  }

  /**
   * Master volume.
   * @type {Number}
   */
  get volume() {
    return this._masterGain.gain.value
  }
  set volume(v) {
    this._masterGain.gain.value = v
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
   * @param {Object} id - The resource ID.
   * @param {Object} buffer - The buffer object.
   * @param {Object} data - The audio metadata.
   * @param {Object} url - The resource url.
   * @return {WebAudioAudio} The audio object.
   */
  createAudio(id, buffer, data, url) {
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

  /**
   * Initialize the system.
   */
  _initialize() {
    this._initializeAudioContext()
    this._initializeMasterVolume()
    this._initializeTouchLock()
  }

  /**
   * Creates the audio context.
   */
  _initializeAudioContext() {
    this._audioContext = this._createAudioContext()
  }

  /**
   * Creates the gain node for master volume.
   */
  _initializeMasterVolume() {
    this._masterGain = this.createGainNode()
    this._masterGain.gain.value = 1
    this._masterGain.connect(this._audioContext.destination)
  }

  /**
   * Sets up the touch lock for iOs.
   * http://stackoverflow.com/questions/24119684
   */
  _initializeTouchLock() {    
    this._scratchBuffer = this._audioContext.createBuffer(1, 1, 22050)

    const unlock = () => {
      // Create an empty buffer.
      var source = this._audioContext.createBufferSource()
      source.buffer = this._scratchBuffer
      source.connect(this._audioContext.destination)

      // Play the empty buffer.
      if (typeof source.start === 'undefined') {
        source.noteOn(0)
      } else {
        source.start(0)
      }

      // Setup a timeout to check that we are unlocked on the next event loop.
      source.onended = () => {
        source.disconnect(0)
        this.game.renderer.view.removeEventListener('touchend', unlock, true)
      }
    }
    this.game.renderer.view.addEventListener('touchend', unlock, true)

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

}