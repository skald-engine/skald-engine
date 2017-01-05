import Manager from 'core/Manager' 
import * as audio from 'audio'

/**
 * - https://www.html5rocks.com/en/tutorials/webaudio/intro/
 *
 * 
 * - https://github.com/goldfire/howler.js
 * - https://github.com/danrossi/audio-engine
 * - https://github.com/johnhornsby/audioengine
 * - https://github.com/cykod/Quintus
 * - https://github.com/CreateJS/SoundJS
 * - https://github.com/photonstorm/phaser/tree/master/v2/src/sound
 * - https://github.com/kittykatattack/sound.js
 * - https://github.com/jaysalvat/buzz
 * - http://zohararad.github.io/audio5js/
 * - https://galactic.ink/midi-js/
 *
 *
 *
 * Role:
 *
 * - Control master volume
 * - Handle sound groups
 * - Initialize and configure the browser audio system
 * - Store individual audios
 *
 * AudioSystem:
 *
 * - Initialize specific audio implementation (webaudio, html5, flash, ...)
 * - Create audio objects from sources
 *
 * Audio:
 *
 * - Object representing an audio source
 * - Play, pause, stop, resume
 * - May play more than one sound
 * 
 */
export default class SoundsManager extends Manager {
  
  constructor(game) {
    super(game)

    this._system = null
    this._audios = {}
  }

  get system() { return this._system }
  
  setup() {
    this._system = new audio.WebAudioSystem()
  }

  createAudio(id, buffer, data) {
    let audio = this._system.createAudio(buffer, data)
    if (id) {
      this._audios[id] = audio
    }
    return audio
  }

  get(id) {
    return this._audios[id]
  }

}