const $ = require('sk/$')
const Service = require('sk/core/Service')
const utils = require('sk/utils')
const BaseAudio = require('sk/core/BaseAudio')

/**
 * WebAudio implementation
 */
class SoundsService extends Service {
  constructor() {
    super('sounds')

    this._context = null
    this._masterNode = null
    this._scratchBuffer = null
    this._isPaused = false

    this._device = null
    this._renderer = null
    this._config = null
  }

  get context() {
    return this._context
  }

  get masterNode() {
    return this._masterNode
  }

  get isPaused() {
    return this._isPaused
  }

  get volume() {
    return this._masterNode.gain.value
  }
  set volume(v) {
    this._masterNode.gain.value = Math.min(Math.max(v, 0), 1)
  }

  setup() {
    let injector = $.getInjector()
    this._renderer = injector.resolve('renderer')
    this._config = injector.resolve('config')
    this._device = injector.resolve('device')
    this._logger = injector.resolve('logger')

    if (this._device.webAudio) {
      this._setupMasterNode()
      this._setupTouchLock()
    } else {
      this._logger.warn('SoundsService disabled because WebAudio is not supported.')
    }
  }

  _setupMasterNode() {
    this._context = new (window.AudioContext||window.webkitAudioContext)()
    this._masterNode = this._context.createGain()
    this._masterNode.gain.value = this._config.get('sounds.master_volume', 1)
    this._masterNode.connect(this._context.destination)
  }

  _setupTouchLock() {
    this._scratchBuffer = this._context.createBuffer(1, 1, 22050)

    const unlock = () => {
      // Create an empty buffer.
      var source = this._context.createBufferSource()
      source.buffer = this._scratchBuffer
      source.connect(this._context.destination)

      // Setup a timeout to check that we are unlocked on the next event loop.
      source.onended = () => {
        source.disconnect()
        this._renderer.view.removeEventListener('mousedown', unlock, true)
        this._renderer.view.removeEventListener('touchend', unlock, true)
      }

      // Play the empty buffer.
      source.start()
    }
    this._renderer.view.addEventListener('mousedown', unlock, true)
    this._renderer.view.addEventListener('touchend', unlock, true)
  }

  createRaw(buffer, metadata) {
    let baseAudio = new BaseAudio(this._context, this._masterNode, metadata)
    return baseAudio
  }
  
  createRawBash(buffer, metadatas) {
    let bases = metadatas.map(m => new BaseAudio(this._context, this._masterNode, m))
    return bases
  }

  create(buffer, metadata) {
    let baseAudio = new BaseAudio(this._context, this._masterNode, metadata)
    this._context.decodeAudioData(buffer, buffer => baseAudio.buffer = buffer)
    return baseAudio
  }

  createBash(buffer, metadatas) {
    let bases = metadatas.map(m => new BaseAudio(this._context, this._masterNode, m))
    this._context.decodeAudioData(buffer, buffer => bases.forEach(b => b.buffer = buffer))
    return bases
  }

  resume() {
    this._isPaused = false
    this._context.resume()
  }

  pause() {
    this._isPaused = true
    this._context.suspend()
  }

  destroy() {
    this._context.close()
  }
}

module.exports = SoundsService