const Audio = require('sk/core/Audio')

class BaseAudio {
  constructor(context, outputNode, metadata) {
    this._context = context
    this._outputNode = outputNode
    this._inputNode = context.createGain()
    this._inputNode.connect(this._outputNode)

    this._buffer = null
    this._audios = []
    this._inactiveAudios = []

    this._markers = {}
    this._offset = 0
    this._duration = null
    this._volume = 1
    this._loop = false
    this._allowMultiple = true

    this._isReady = false
    this._isMuted = false
    this._isPaused = false

    this.initialize(metadata)
  }

  get context() { return this._context }

  get inputNode() { return this._inputNode }

  get outputNode() { return this._outputNode }
  set outputNode(v) {
    this._outputNode = v
    this._inputNode.disconnect()
    this._inputNode.connect(v)
  }

  get offset() { return this._offset }
  set offset(v) { this._offset = v }

  get duration() { return this._duration }
  set duration(v) { this._duration = v }

  get volume() { return this._volume }
  set volume(v) { 
    this._volume = Math.min(Math.max(v, 0), 1)
    if (!this._isMuted) {
      this._inputNode.gain.value = v
    }
  }

  get loop() { return this._loop }
  set loop(v) { this._loop = !!v }

  get allowMultiple() { return this._allowMultiple }
  set allowMultiple(v) { this._allowMultiple = !!v }

  get buffer() { return this._buffer }
  set buffer(value) {
    this._buffer = value
    this._isReady = true

    let audios = this._audios.slice()
    for (let i=0; i<audios.length; i++) {
      audios[i].play()

      if (this._isPaused) {
        audios[i].pause()
      }
    }
  }

  initialize(metadata) {
    metadata = metadata || {}
    if (typeof metadata.offset === 'number') this.offset = metadata.offset
    if (typeof metadata.duration === 'number') this.duration = metadata.duration
    if (typeof metadata.volume === 'number') this.volume = metadata.volume
    if (typeof metadata.loop !== 'undefined') this.loop = !!metadata.loop
    if (typeof metadata.allowMultiple !== 'undefined') this.allowMultiple = !!metadata.allowMultiple

    if (metadata.markers) {
      let keys = Object.keys(metadata.markers)
      for (let i=0; i<keys.length; i++) {
        let key = keys[i]
        let marker = metadata.markers[key]

        let offset = undefined
        let duration = undefined
        let volume = undefined
        let loop = undefined

        if (typeof marker.offset === 'number') offset = marker.offset
        if (typeof marker.duration === 'number') duration = marker.duration
        if (typeof marker.volume === 'number') volume = marker.volume
        if (typeof marker.loop !== 'undefined') loop = !!marker.loop

        this.addMarker(key, offset, duration, volume, loop)
      }
    }
  }

  isReady() { return this._isReady }

  isMuted() { return this._isMuted }

  isPaused() { return this._isPaused }

  isPlaying() { return !!this._audios.length }

  _onFinish(audio) {
    let idx = this._audios.indexOf(audio)
    if (idx >= 0) {
      this._audios.splice(idx, 1)
    }

    this._inactiveAudios.push(audio)
    if (this._inactiveAudios.length > 10) {
      this._inactiveAudios.shift()
    }
  }

  play(id, offset, duration, volume, loop) {
    if (typeof id !== 'undefined' && id !== null) {
      let marker = this._markers[id]
      if (!marker) return // invalid marker

      if (typeof offset !== 'number') offset = marker.offset
      if (typeof duration !== 'number') duration = marker.duration
      if (typeof volume !== 'number') volume = marker.volume
      if (typeof loop === 'undefined') loop = marker.loop
    }

    if (!this._allowMultiple) {
      let audios = this._audios.slice()
      for (let i=0; i<audios.length; i++) {
        audios[i].stop()
      }
    }

    if (typeof offset !== 'number') offset = this._offset || 0
    if (typeof duration !== 'number') duration = this._duration || undefined
    if (typeof volume !== 'number') volume = this._volume
    if (typeof loop === 'undefined') loop = !!this._loop

    let audio = null
    if (this._inactiveAudios.length) {
      audio = this._inactiveAudios.shift()
    } else {
      audio = new Audio(this)
    }

    audio.setup(offset, duration, volume, loop)
    this._audios.push(audio)

    if (this._isReady) {
      audio.play()

      if (this._isPaused) {
        audio.pause()
      }
    }

    return audio
  }

  pause() {
    if (this._isPaused) return
    
    this._isPaused = true
    let audios = this._audios.slice()
    for (let i=0; i<audios.length; i++) {
      audios[i].pause()
    }
  }

  resume() {
    if (!this._isPaused) return
    
    this._isPaused = false
    let audios = this._audios.slice()
    for (let i=0; i<audios.length; i++) {
      audios[i].resume()
    }
  }

  stop() {
    let audios = this._audios.slice()
    for (let i=0; i<audios.length; i++) {
      audios[i].stop()
    }
  }

  mute() {
    this._isMuted = true
    this._inputNode.gain.value = 0
  }

  unmute() {
    this._isMuted = false
    this._inputNode.gain.value = this._volume
  }

  addMarker(id, offset, duration, volume, loop) {
    if (typeof offset !== 'number') offset = undefined
    if (typeof duration !== 'number') duration = undefined
    if (typeof volume !== 'number') volume = undefined
    if (typeof volume === 'number') volume = Math.min(Math.min(volume, 0), 1)
    loop = !!loop
    
    this._markers[id] = {
      name     : name,
      offset   : offset,
      duration : duration,
      volume   : volume,
      loop     : loop,
    }
  }

  removeMarker(id) {
    delete this._markers[id]
  }

  remoteAllMarkers() {
    this._markers = {}
  }

  getMarker(id) {
    return this._markers[id]
  }

  listMakers() {
    return Object.keys(this._markers)
  }
}

module.exports = BaseAudio