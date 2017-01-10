import AudioSystem from 'core/AudioSystem'
import Audio from 'audio/html5/HTML5Audio'
import * as utils from 'utils'


export default class HTML5AudioSystem extends AudioSystem {

  /**
   * @param {Game} game - The game instance
   */
  constructor(game) {
    super(game)
    
    this._inactiveTags = []
    this._volume = 1
    this._type = 'html5'

    if (!HTML5AudioSystem.canUse()) {
      throw new Error(`Trying to use HTML5 audio system in a platform that `+ 
                      `does not support it.`)
    }

    this._initialize()
  }

  get volume() {
    return this._volume
  }
  set volume(v) {
    if (typeof v !== 'number') {
      throw new Error(`Invalid volume value, you must provide a number `+
                      `between 0 and 1.`)
    }

    v = utils.clip(v, 0, 1)
    
    this._volume = v
    let audioIds = this._game.sounds.list()
    for (let i=0; i<audioIds.length; i++) {
      let audio = this._game.sounds.get(audioIds[i])

      audio.adjustMasterVolume(v)
    }
  }

  static canUse() {
    return !!window.Audio
  }

  createAudio(id, buffer, data, url) {
    let audio = new Audio(this.game, this, id, buffer, url)

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

    return audio
  }
  
  getInactiveTag() {
    return this._inactiveTags.shift() || new window.Audio()
  }
  addInactiveTag(tag) {
    this._inactiveTags.push(tag)
  }

  _initialize() {
    // pre create html5 audio tags
    for (let i=0; i<4; i++) {
      let tag = new window.Audio()
      tag._id = (''+Math.random()).substring(2)
      this._inactiveTags.push(tag)
    }
  }
}