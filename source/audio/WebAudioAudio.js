import BaseAudio from 'core/BaseAudio'
import * as utils from 'utils'

let NEXT_ID = 1

class Sound {
  constructor(system, audio) {
    this._audio    = audio
    this._system   = system
    this._id       = null
    this._offset   = null
    this._duration = null
    this._delay    = null
    this._volume   = null
    this._loop     = null

    this._source   = null
    this._gain     = null

    this._startedAt   = null
    this._currentTime = 0
    this._playing     = false
    this._paused      = false
    this._muted       = false

    this._gain = system.createGainNode()
    this._gain.connect(audio._masterGain)
  }


  get offset() { return this._offset }
  set offset(v) { this._offset = v }

  get duration() { return this._duration }
  set duration(v) { this._duration = v }

  get delay() { return this._delay }
  set delay(v) { this._delay = v }

  get volume() { return this._volume }
  set volume(v) {
    this._volume = v
    if (!this._muted) {
      this._gain.gain.value = v
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
    this._duration = this._duration || this._audio._buffer.duration*1000

    this._source = this._system._audioContext.createBufferSource()
    this._source.onended = () => this._onFinish()
    this._source.buffer = this._audio._buffer
    this._source.connect(this._gain)

    this._source.start(this.delay/1000, this.offset/1000, this.duration/1000)
    this._playing = true
    this._paused = false

    this._startedAt = Date.now()
    this._currentTime = this._offset
  }
  stop() {
    this._playing = false
    this._paused = false
    this._source.onended = null
    this._source.stop()
  }
  pause() {
    this._paused = true
    this._playing = false
    this._currentTime += Date.now() - this._startedAt
    this._source.onended = null
    this._source.stop()
  }
  resume() {
    let offset = this._currentTime/1000
    let duration = this._duration/1000 - offset

    this._source = this._system._audioContext.createBufferSource()
    this._source.onended = () => this._onFinish()
    this._source.buffer = this._audio._buffer
    this._source.connect(this._gain)
    this._source.start(0, offset, duration)
    this._paused = false
    this._playing = true
    this._startedAt = Date.now()
  }

  mute() {
    this._muted = true
    this._gain.gain.value = 0
  }
  unmute() {
    this._muted = false
    this._gain.gain.value = this._volume
  }
}











export default class WebAudioAudio extends BaseAudio {
  constructor(system, masterGain) {
    super(system)

    this._system = system
    this._masterGain = masterGain
    this._buffer = null
    this._sounds = {}
    this._pendingSounds = []
    this._inactiveSounds = []
    this._type = 'webaudio'
    this._allowMultiple = true

    this._offset   = null
    this._duration = null
    this._delay    = null
    this._volume   = null
    this._loop     = null
  }


  get offset() { return this._offset }
  set offset(v) { this._offset = v}

  get duration() { return this._duration }
  set duration(v) { this._duration = v}

  get delay() { return this._delay }
  set delay(v) { this._delay = v}

  get volume() { return this._volume }
  set volume(v) { this._volume = v}

  get loop() { return this._loop }
  set loop(v) { this._loop = !!v}

  get source() { return this._source }
  get gain() { return this._gain }
  get system() { return this._system }
  get sound() { return this._sounds }
  get type() { return this._type }
  get allowMultiple() { return this._allowMultiple }
  set allowMultiple(v) { this._allowMultiple = !!v}

  get buffer() { return this._buffer }
  set buffer(value) {
    this._buffer = value
    this._ready = true

    if (this._pendingSounds.length) {
      for (let i=0; i<this._pendingSounds.length; i++) {
        let a = this._pendingSounds[i]
        this.play(null,
          a[0],
          a[1],
          a[2],
          a[3],
          a[4]
        )
      }
    }
  }

  isReady() {
    return this._ready
  }

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

  isAlive(id) {
    return !!this._sounds[id]
  }

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


  play(markerOrId, offset, duration, delay, volume, loop) {
    super.play(markerOrId, offset, duration, delay, volume, loop)

    // get marker 
    if (typeof markerOrId === 'string') {
      let marker = this._markers[markerOrId]
      if (!marker) return // invalid marker

      offset   = offset   || marker.offset
      duration = duration || marker.duration
      delay    = delay    || marker.delay
      volume   = volume   || marker.volume
      loop     = loop     || marker.loop
    }

    // get sound id
    let id = null
    if (typeof markerOrId === 'number') {
      if (!this._sounds[markerOrId]) return // invalid id
      id = markerOrId
    }

    // if the sound is not ready, we add it to pending
    if (!this.isReady()) {
      this._pendingSounds.push([offset, duration, delay, volume, loop])
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
      this._sounds = {id:sound}
    }

    // default values
    sound.offset   = offset || this._offset || 0
    sound.duration = duration || this._duration || undefined
    sound.delay    = delay || this._delay || 0
    sound.volume   = utils.clip(volume || this._volume || 1, 0, 1)
    sound.loop     = !!(loop || this._loop || false)

    // play it
    sound.play()
    return id
  }
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

  _pruneSounds() {
    if (this._inactiveSounds.length > 10) {
      this._inactiveSounds = []
    }
  }
}