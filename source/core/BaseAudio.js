import * as utils from 'utils'
/**
 * Roles:
 *
 * - Allow multiple playback of the same sound
 * - Use single audio from audio sprite
 * - Adjust volume
 * - Add effects, if possible
 * - Pause, Resume
 * - Pending play if sound is not ready
 * - Add markers
 */
export default class BaseAudio {
  constructor(system) {
    this._system = system

    this._markers = {}
  }

  isReady() {}
  isPlaying(id) {}
  isPaused(id) {}
  isMuted(id) {}

  setVolume(id, value) {}
  getVolume(id) {}
  setLoop(id, value) {}
  getLoop(id) {}

  play(markerOrId, offset, duration, delay, volume, loop) {
    if (offset && (typeof offset !== 'number' || offset < 0)) {
      throw new Error(`Invalid offset value "${offset}".`)
    }

    if (duration && (typeof duration !== 'number' || delay < 0)) {
      throw new Error(`Invalid duration value "${duration}".`)
    }

    if (delay && (typeof delay !== 'number' || delay < 0)) {
      throw new Error(`Invalid delay value "${delay}".`)
    }

    if (volume && typeof volume !== 'number') {
      throw new Error(`Invalid volume value "${volume}".`)
    }
  }
  resume(id) {}
  stop(id) {}
  pause(id) {}

  mute(id) {}
  unmute(id) {}

  addMarker(markerName, offset, duration, volume, loop) {
    if (typeof offset !== 'number') offset = undefined
    if (typeof duration !== 'number') duration = undefined
    if (typeof volume !== 'number') volume = undefined
    if (typeof volume === 'number') volume = utils.clip(volume, 0, 1)
    
    lopp = !!loop
    this._markers[markerName] = {
      name     : name,
      offset   : offset,
      duration : duration,
      volume   : volume,
      loop     : loop,
    }
  }
  removeMarker(markerName) {
    delete this._markers[markerName]
  }
  removeAllMarkers() {
    this._markers = {}
  }
  getMarkers(markerName) {
    return this._markers[markerName]
  }
  listMarkers() {
    return Object.keys(this._markers)
  }
}