
class Audio {
  constructor(baseAudio) {
    this._baseAudio  = baseAudio
    this._context    = baseAudio.context

    this._offset   = null
    this._duration = null
    this._volume   = null
    this._loop     = null
    
    this._source    = null
    this._inputNode = null

    this._startedAt   = null
    this._currentTime = 0
    
    this._isPlaying = false
    this._isPaused  = false
    this._isMuted   = false
    this._isAlive   = true

    this._inputNode = this._context.createGain()
    this._inputNode.connect(baseAudio.inputNode)
  }

  get inputNode() { return this._inputNode }

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

  setup(offset, duration, volume, loop) {
    this._offset      = offset
    this._duration    = duration
    this._volume      = volume
    this._loop        = loop
    this._isPlaying   = false
    this._isPaused    = false
    this._isMuted     = false
    this._isAlive     = true
    this._startedAt   = null
    this._currentTime = 0
  }

  isAlive() { return this._isAlive }
  isReady() { return this._baseAudio.isReady() }
  isPlaying() { return this._isPlaying }
  isMuted() { return this._isMuted }
  isPaused() { return this._isPaused }

  _onFinish() {
    if (this._loop) {
      this._isPlaying = false
      this.play()
    } else {
      this.stop()
    }
  }

  play() {
    if (this._isPlaying) return

    if (!this._isAlive) {
      throw new Error(`Trying to play a dead sound.`)
    }

    this._duration = this._duration || this._baseAudio.buffer.duration*1000

    this._source = this._context.createBufferSource()
    this._source.onended = () => this._onFinish()
    this._source.buffer = this._baseAudio.buffer
    this._source.connect(this._inputNode)

    this._startedAt = window.performance.now()
    this._currentTime = this._offset

    this._source.start(0, this._offset/1000, this._duration/1000)
    this._isPlaying = true
    this._isPaused = false
  }

  stop() {
    if (this._isAlive) {
      this._isAlive = false
      this._isPlaying = false
      this._isPaused = false
      
      if (this._source) { 
        this._source.onended = null
        this._source.stop()
      }

      this._baseAudio._onFinish(this)
    }
  }
  pause() {
    if (this._isPaused || !this._isAlive) return

    this._isPaused = true
    this._isPlaying = false
    this._currentTime += window.performance.now() - this._startedAt
    if (this._source) { 
      this._source.onended = null
      this._source.stop()
    }
  }
  resume() {
    if (this._isPlaying) return

    if (!this._isAlive) {
      throw new Error(`Trying to resume a dead sound.`)
    }

    this._duration = this._duration || this._baseAudio.buffer.duration*1000

    let offset = this._currentTime/1000
    let duration = this._duration/1000 - offset

    this._source = this._context.createBufferSource()
    this._source.onended = () => this._onFinish()
    this._source.buffer = this._baseAudio._buffer
    this._source.connect(this._inputNode)
    this._source.start(0, offset, duration)
    this._isPaused = false
    this._isPlaying = true
    this._startedAt = window.performance.now()
  }
  mute() {
    this._isMuted = true
    this._inputNode.gain.value = 0
  }
  unmute() {
    this._isMuted = false
    this._inputNode.gain.value = this._volume
  }
}

module.exports = Audio