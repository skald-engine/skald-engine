import Manager from 'core/Manager' 
import * as audio from 'audio'

/**
 * The sounds manager handle the storage and initialization of the game audios.
 * This manager is created by the game and can be accessed via `game.sounds`.
 *
 * Skald implements a flexible audio system, which currently accepts WebAudio
 * and HTML5 audio, but can be expanded to more systems. Check it out the
 * {@link AudioSystem} class and the `skald.audio` package to learn more and
 * see implementation examples.
 *
 * Our audio system is based on [Howler](https://github.com/goldfire/howler.js),
 * in which each audio file is represented by an Audio object, and it can be
 * played multiple times (or not, depending on your configuration) with 
 * different settings. Check the {@link BaseAudio} interface to see more about
 * what you can do with the audio objects.
 *
 * Right now, we only support loading sounds via `resources` manager.
 *
 * You may set which audio systems may work and in which order they will be 
 * tested in your game:
 *
 *     skald.globals.setAudioSystems([
 *       skald.audio.WebAudioSystem,
 *       skald.audio.HTML5System,
 *       MyCustomSystem
 *     ])
 *     game = new skald.Game()
 *
 * The manager will test each system to verify if it can run in the user 
 * platform, and will select the first one that works. Notice that, you must
 * set the audio systems BEFORE the creation of the game and it can't be 
 * changed after that.
 *
 *
 * Role:
 *
 * - Control master volume
 * - Handle sound groups
 * - Initialize and configure the browser audio system
 * - Store individual audios
 * * 
 */
export default class SoundsManager extends Manager {
  
  constructor(game) {
    super(game)

    this._system = null
    this._audios = {}
  }

  get system() { return this._system }

  get volume() {}
  set volume(v) {}
  
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