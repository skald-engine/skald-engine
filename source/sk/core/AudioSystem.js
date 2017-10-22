/**
 * AudioSystem if the abstract base class for all audio implementations in the 
 * Skald engine. All audio systems must provide the methods:
 *
 * - **canUse** as static, telling the engine if this system can be used on the
 *   running platform.
 * - **createAudio** to create the specific audio on this system.
 */
class AudioSystem {
  /**
   * @param {Game} game - The game object
   */
  constructor(game) {
    this._game = game
    this._type = null
  }

  /**
   * The game instance. Readonly.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * Sets or gets the volume.
   * @type {Number}
   */
  get volume() {}
  set volume(v) {}

  /**
   * The name of the system. Readonly.
   * @type {String}
   */
  get type() { return this._type }

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
   * Creates a new audio given a buffer object and a metadata.
   *
   * @param {String} id - The resource string.
   * @param {Object} buffer - The buffer object.
   * @param {Object} data - The audio metadata.
   * @param {String} url - The resource URL.
   * @return {BaseAudio} - The audio object.
   */
  createAudio(id, buffer, data, url) {}

  /**
   * Whether the browser can use this system or not.
   *
   * @return {Boolean}
   */
  static canUse() {}
}


module.exports = AudioSystem