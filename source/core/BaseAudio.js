import * as utils from 'utils'


/**
 * The base audio represents an audio file. This audio:
 *
 * - Allows multiple playback
 * - Adjust volume
 * - Add effects, if possible
 * - Can be paused, and resume
 * - Can be muted or unmuted
 * - Adds the playback to a pending list if sound is not ready
 * - Can add markers
 *
 * We use a mechanism similar to [Howler](https://github.com/goldfire/howler.js)
 * in which every `play` command returns an ID of the current playback, you
 * can check this playback status, or pause, mute, stop it by using this ID. 
 * You may also mute, pause, stop all playbacks by not using any id.
 *
 * Notice that, the bause audio can't be used directly, instead, it is used as
 * base for system audios. Check `skald.audio` package to see its 
 * implementations.
 *
 * All timing values in the audio systems are represented in milliseconds.
 */
export default class BaseAudio {
  /**
   * @param {AudioSystem} system - The audio system implementation.
   */
  constructor(system) {
    this._system = system

    this._type = 'none'
    this._markers = {}
    this._offset = null
    this._duration = null
    this._volume = null
    this._loop = null
    this._allowMultiple = true
  }

  /**
   * Offset of the audio (the amount of time which will be skipped on the
   * playback).
   * @type {Number}
   */
  get offset() { return this._offset }
  set offset(v) { this._offset = v }

  /**
   * Duration of the audio (the amount of time which will be played).
   * @type {Number}
   */
  get duration() { return this._duration }
  set duration(v) { this._duration = v }

  /**
   * Volume of the audio.
   * @type {Number}
   */
  get volume() { return this._volume }
  set volume(v) { this._volume = v }

  /**
   * Whether the audio should play in loop or not.
   * @type {Boolean}
   */
  get loop() { return this._loop }
  set loop(v) { this._loop = !!v }

  /**
   * Whether this audio accepts multiple playback (at the same time) or not.
   * @type {Boolean}
   */
  get allowMultiple() { return this._allowMultiple }
  set allowMultiple(v) { this._allowMultiple = !!v }

  /**
   * The type of the audio. Should be implemented in the inherited classes.
   * Readonly.
   * @type {String}
   */
  get type() { return this._type }

  /**
   * The audio system owner of this audio. Readonly.
   * @type {AudioSystem}
   */
  get system() { return this._system }


  /**
   * Sets a batch of variables.
   *
   * @param {Object} config - The dictionary of variables and their values.
   */
  configure(config) {
    Object.assign(this, config)
    return this
  }

  /**
   * Check if this audio is ready to play. You may still call the `play` 
   * method, however, the playback will be pending until the audio is ready.
   *
   * @return {Boolean}
   */
  isReady() {}

  /**
   * Check if this audio or an specific playback is playing. Notice that paused
   * playbacks will return false here. If the ID is not provided, this method
   * will return true if ANY playback is playing.
   *
   * @param {Number} [id] - The ID of the specific playback
   * @return {Boolean}
   */
  isPlaying(id) {}

  /**
   * Check if this audio or an specific playback is paused. If the ID is not
   * provided, this method will return true if ANY playback is paused.
   *
   * @param {Number} [id] - The ID of the specific playback
   * @return {Boolean}
   */
  isPaused(id) {}

  /**
   * Check if this audio or an specific playback is muted. If the ID is not
   * provided, this method will return true if ANY playback is muted.
   *
   * @param {Number} [id] - The ID of the specific playback
   * @return {Boolean}
   */
  isMuted(id) {}

  /**
   * Check if the specific playback is alive (playing or paused).
   *
   * @param {Number} id - The ID of the specific playback
   * @return {Boolean}
   */
  isAlive(id) {}

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
    if (offset && (typeof offset !== 'number' || offset < 0)) {
      throw new Error(`Invalid offset value "${offset}".`)
    }

    if (duration && (typeof duration !== 'number' || duration < 0)) {
      throw new Error(`Invalid duration value "${duration}".`)
    }

    if (volume && typeof volume !== 'number') {
      throw new Error(`Invalid volume value "${volume}".`)
    }
  }

  /**
   * Stop a playback. If ID is not provided, this method will stop all 
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  stop(id) {}

  /**
   * Pause a paused playback. If ID is not provided, this method will pause all
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  pause(id) {}

  /**
   * Resume a paused playback. If ID is not provided, this method will resume
   * all paused playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  resume(id) {}

  /**
   * Mute a playback. If ID is not provided, this method will mute all
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  mute(id) {}

  /**
   * Unmute a playback. If ID is not provided, this method will unmute all
   * playbacks.
   *
   * @param {Number} [id] - The playback ID.
   */
  unmute(id) {}

  /**
   * Adds a marker on this audio, setting a specific offset, duration, volume
   * or loop flag.
   *
   * @param {String} markerName - The marker name.
   * @param {Number} [offset] - The offset of the playback.
   * @param {Number} [duration] - The duration of the playback.
   * @param {Number} [volume] - The volume of the playback.
   * @param {Number} [loop] - If the playback should loop.
   */
  addMarker(markerName, offset, duration, volume, loop) {
    if (typeof offset !== 'number') offset = undefined
    if (typeof duration !== 'number') duration = undefined
    if (typeof volume !== 'number') volume = undefined
    if (typeof volume === 'number') volume = utils.clip(volume, 0, 1)
    loop = !!loop
    
    this._markers[markerName] = {
      name     : name,
      offset   : offset,
      duration : duration,
      volume   : volume,
      loop     : loop,
    }
  }

  /**
   * Removes a marker.
   *
   * @param {String} markerName - The marker name.
   */
  removeMarker(markerName) {
    delete this._markers[markerName]
  }

  /**
   * Removes all markers.
   */
  removeAllMarkers() {
    this._markers = {}
  }

  /**
   * Get a marker.
   *
   * @param {String} markerName - The marker name.
   * @return {Object} The marker object.
   */
  getMarkers(markerName) {
    return this._markers[markerName]
  }

  /**
   * List all markers registered in this audio.
   *
   * @return {Array<String>} The list of all marker names.
   */
  listMarkers() {
    return Object.keys(this._markers)
  }
}