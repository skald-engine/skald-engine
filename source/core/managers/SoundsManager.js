import Manager from 'core/Manager' 
import * as audio from 'audio'
import * as globals from 'globals_'

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
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._system = null
    this._audios = {}
  }

  /**
   * The loaded system instance. Readonly.
   * @type {AudioSystem}
   */
  get system() { return this._system }

  /**
   * The master volume.
   * @type {Number}
   */
  get volume() {
    if (this._system) {
      return this._system.volume
    }
  }
  set volume(v) {
    if (this._system) {
      this._system.volume = v
    }
  }
  
  /**
   * Initializes the manager. Called automatically by the game, do not call it
   * manually.
   */
  setup() {
    if (globals.audioSystems.length) {
      for (let i=0; i<globals.audioSystems.length; i++) {
        if (globals.audioSystems[i].canUse()) {
          this._system = new globals.audioSystems[i](this.game)
          return
        }
      }
    }

    this.game.log.warn(`(sounds) No audio system was detected.`)
  }

  /**
   * Creates a new audio. Called by resources.
   *
   * @param {String} id - The audio ID, same used in the resources for loading.
   * @param {Object} buffer - The audio buffer.
   * @param {Object} data - The audio metadata.
   * @return {BaseAudio}
   */
  createAudio(id, buffer, data) {
    if (!this._system) return

    let audio = this._system.createAudio(buffer, data)
    if (id) {
      this._audios[id] = audio
    }
    return audio
  }

  /**
   * Gets and audio.
   * 
   * @param {String} id - The audio ID, same used in the resources for loading.
   * @return {BaseAudio}
   */
  get(id) {
    if (!this._system) return

    return this._audios[id]
  }

}