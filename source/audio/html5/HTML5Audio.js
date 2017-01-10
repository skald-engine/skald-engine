import BaseAudio from 'core/BaseAudio'
import * as utils from 'utils'

/**
 * Global id generator.
 */
let NEXT_ID = 1

export default class HTML5Audio extends BaseAudio {

  /**
   * @param {AudioSystem} system - The system instance.
   */
  constructor(game, system, id, buffer, url) {
    super(system)

    this._game = game
    this._id = id
    this._url = url
    this._buffer = buffer
    this._ready = true
    this._sounds = {}
    this._inactiveSounds = []
    this._type = 'html5'
  }

  /**
   * The audio ID.
   * @type {String}
   */
  get id() { return this._id }

  /**
   * Volume of the audio.
   * @type {Number}
   */
  set volume(v) {
    if (typeof v !== 'number') {
      throw new Error(`Invalid volume value, you must provide a number `+
                      `between 0 and 1.`)
    }

    v = utils.clip(v, 0, 1)

    let ids = Object.keys(this._sounds)
    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (sound.volume === this._volume) {
        sound.volume = v
      }
    }

    this._volume = v
  }

  /**
   * The audio buffer object.
   * @type {Object}
   */
  get buffer() { return this._buffer }
  set buffer(value) { this._buffer = value }

  /**
   * Check if this audio is ready to play. You may still call the `play` 
   * method, however, the playback will be pending until the audio is ready.
   *
   * @return {Boolean}
   */
  isReady() { return this._ready }

  /**
   * Check if this audio or an specific playback is playing. Notice that paused
   * playbacks will return false here. If the ID is not provided, this method
   * will return true if ANY playback is playing.
   *
   * @param {Number} [id] - The ID of the specific playback
   * @return {Boolean}
   */
  isPlaying(id) {
    let ids = id? [id] : Object.keys(this._sounds)

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (sound && sound.isPlaying()) {
        return true
      }
    }

    return false
  }

  /**
   * Check if this audio or an specific playback is paused. If the ID is not
   * provided, this method will return true if ANY playback is paused.
   *
   * @param {Number} [id] - The ID of the specific playback
   * @return {Boolean}
   */
  isPaused(id) { 
    let ids = id? [id] : Object.keys(this._sounds)

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (sound && sound.isPaused()) {
        return true
      }
    }

    return false
  }

  /**
   * Check if this audio or an specific playback is muted. If the ID is not
   * provided, this method will return true if ANY playback is muted.
   *
   * @param {Number} [id] - The ID of the specific playback
   * @return {Boolean}
   */
  isMuted(id) {
    let ids = id? [id] : Object.keys(this._sounds)

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (sound && sound.isMuted()) {
        return true
      }
    }

    return false
  }

  /**
   * Check if the specific playback is alive (playing or paused).
   *
   * @param {Number} id - The ID of the specific playback
   * @return {Boolean}
   */
  isAlive(id) {
    return !!this._sounds[id]
  }

  /**
   * Play this audio, may use a marker or specific configuration.
   *
   * You may pass a string with the marker name (which should be registered 
   * previously on this audio object) or an ID for a paused playback. If the 
   * playback is not paused or does not exist, the ID will be ignored.
   *
   * The values for offset, duration, volume or loop will override any previous
   * settings of the audio or the marker.
   *
   * @param {String|Number} [markerOrId] - The marker name or an ID for a 
   *        playback.
   * @param {Number} [offset] - The offset of the playback.
   * @param {Number} [duration] - The duration of the playback.
   * @param {Number} [volume] - The volume of the playback.
   * @param {Number} [loop] - If the playback should loop.
   * @return {Number} The ID of the playback.
   */
  play(markerOrId, offset, duration, volume, loop) {
    super.play(markerOrId, offset, duration, volume, loop)

    // get marker 
    if (typeof markerOrId === 'string') {
      let marker = this._markers[markerOrId]
      if (!marker) return // invalid marker

      if (typeof offset !== 'number') offset = marker.offset
      if (typeof duration !== 'number') duration = marker.duration
      if (typeof volume !== 'number') volume = marker.volume
      if (typeof loop === 'undefined') loop = marker.loop
    }

    // get sound id
    let id = null
    if (typeof markerOrId === 'number') {
      if (!this._sounds[markerOrId]) return // invalid id
      id = markerOrId
    }

    // if the sound is not ready, we add it to pending
    if (!this.isReady()) {
      this._pendingSounds.push([offset, duration, volume, loop])
      return id
    }

    // create sound if id is not provided
    if (!id) {
      id = this._createSound()
    }

    // if the sound is playing and it doesn't allo multiple instances, stop all
    // before playing
    let sound = this._sounds[id]
    let ids = Object.keys(this._sounds)
    if (!this._allowMultiple && ids.length > 1)  {
      for (let i=0; i<ids.length; i++) {
        if (ids[i] == id) continue

        let s = this._sounds[ids[i]]
        s.stop()
      }
      this._sounds = {[id]:sound}
    }

    // default values
    if (typeof offset !== 'number') offset = this._offset || 0
    if (typeof duration !== 'number') duration = this._duration || undefined
    if (typeof volume !== 'number') volume = utils.clip(this._volume||1, 0, 1)
    if (typeof loop === 'undefined') loop = !!(this._loop || false)
    sound.offset = offset
    sound.duration = duration
    sound.volume = volume
    sound.loop = loop
  
    // play it
    sound.play()
    return id
  }

  /**
   * Stop a playback. If ID is not provided, this method will stop all 
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  stop(id) {
    let ids = [id]
    if (typeof id !== 'number') {
      ids = Object.keys(this._sounds)
    }

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (!sound) continue

      if (sound.isPlaying()) sound.stop()
        
      delete this._sounds[ids[i]]
      this._inactiveSounds.push(sound)
    }

    this._pruneSounds()
  }

  /**
   * Pause a paused playback. If ID is not provided, this method will pause all
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  pause(id) {
    let ids = [id]
    if (typeof id !== 'number') {
      ids = Object.keys(this._sounds)
    }

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (!sound) continue
        
      if (sound.isPlaying()) sound.pause()
    }
  }

  /**
   * Resume a paused playback. If ID is not provided, this method will resume
   * all paused playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  resume(id) {
    let ids = [id]
    if (typeof id !== 'number') {
      ids = Object.keys(this._sounds)
    }

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (!sound) continue
        
      if (sound.isPaused()) sound.resume()
    }
  }
  
  /**
   * Mute a playback. If ID is not provided, this method will mute all
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  mute(id) {
    let ids = [id]
    if (typeof id !== 'number') {
      ids = Object.keys(this._sounds)
    }

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (!sound) continue
        
      sound.mute()
    }
  }

  /**
   * Unmute a playback. If ID is not provided, this method will unmute all
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  unmute(id) {
    let ids = [id]
    if (typeof id !== 'number') {
      ids = Object.keys(this._sounds)
    }

    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      if (!sound) continue
        
      sound.unmute()
    }
  }

  adjustMasterVolume(v) {
    let ids = Object.keys(this._sounds)
    for (let i=0; i<ids.length; i++) {
      let sound = this._sounds[ids[i]]
      sound.volume = sound.volume // forces new master volume
    }
  }

  /**
   * Creates a new playback instance.
   * 
   * @return {Number} The playback ID.
   */
  _createSound() {
    let id = NEXT_ID++
    let sound = this._inactiveSounds.shift()

    if (!sound) {
      sound = new Sound(this.system, this)
    }

    sound.reset()
    sound._id = id
    this._sounds[id] = sound

    return id
  }

  /**
   * Prune excessive inactive sounds.
   */
  _pruneSounds() {
    if (this._inactiveSounds.length > 10) {
      this._inactiveSounds = []
    }
  }
}

/**
 * Playback instance, it represents a single playback of the given audio. It
 * implements the same interface of BaseAudio.
 * @private
 */
class Sound {
  constructor(system, audio) {
    this._audio    = audio
    this._system   = system
    this._id       = null
    this._offset   = null
    this._duration = null
    this._volume   = null
    this._loop     = null

    this._startedAt   = null
    this._currentTime = 0
    this._playing     = false
    this._paused      = false
    this._muted       = false

    this._timeout = null

    let self = this
    this._onEndedCallback = () => self._onFinish()
    this._onSuspendedCallback = () => self._onFinish()
    this._onPauseCallback = () => self._onFinish()
    this._onErrorCallback = () => self._onFinish()
    this._onTimeoutCallback = () => self._onFinish()
  }


  get offset() { return this._offset }
  set offset(v) { this._offset = v }

  get duration() { return this._duration }
  set duration(v) { this._duration = v }

  get volume() { return this._volume }
  set volume(v) {
    this._volume = v
    if (this._source) {
      this._source.volume = v * this._system.volume
    }
  }

  get loop() { return this._loop }
  set loop(v) { this._loop = !!v }


  isPlaying() {
    return this._playing
  }
  isPaused() {
    return this._paused
  }
  isMuted() {
    return this._muted
  }

  _onFinish() {
    if (!this._loop) {
      this._audio.stop(this._id)
    } else {
      this.stop()
      this.play()
    }
  }

  reset() {
    this._playing     = false
    this._paused      = false
    this._muted       = false
    this._currentTime = 0
  }

  play() {
    this._playSound(this._offset/1000, (this._duration||0)/1000)
    this._playing = true
    this._paused = false
    this._startedAt = Date.now()
    this._currentTime = this._offset
  }
  stop() {
    this._playing = false
    this._paused = false
    this._stopSound()
  }
  pause() {
    this._paused = true
    this._playing = false
    this._currentTime += Date.now() - this._startedAt
    this._stopSound()
  }
  resume() {
    let offset = this._currentTime/1000
    let duration = this._duration/1000 - offset

    this._playSound(offset, duration)
    this._paused = false
    this._playing = true
    this._startedAt = Date.now()
  }

  mute() {
    this._muted = true
    if (this._source) this._source.muted = true
  }
  unmute() {
    this._muted = false
    if (this._source) this._source.muted = false
  }

  _playSound(offset, duration) {
    this._source = this._system.getInactiveTag()
    this._source.addEventListener('ended', this._onEndedCallback)
    this._source.addEventListener('suspended', this._onSuspendedCallback)
    this._source.addEventListener('pause', this._onPauseCallback)
    this._source.addEventListener('error', this._onErrorCallback)

    this._source.src = this._audio._url
    this._source.currentTime = offset
    this._source.volume = this._volume * this._system.volume
    this._source.preload = 'auto'
    this._source.load()
    this._source.play()

    if (duration) {
      this._timeout = setTimeout(this._onTimeoutCallback, duration*1000)
    }
  }

  _stopSound() {
    this._source.removeEventListener('ended', this._onEndedCallback)
    this._source.removeEventListener('suspended', this._onSuspendedCallback)
    this._source.removeEventListener('pause', this._onPauseCallback)
    this._source.removeEventListener('error', this._onErrorCallback)

    this._source.pause()
    this._system.addInactiveTag(this._source)
    this._source = null

    if (this._timeout) {
      clearTimeout(this._timeout)
    }
  }
}
