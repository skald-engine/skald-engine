import spriteSheetMetadataSchema from 'sk/config/spriteSheetMetadataSchema'
import * as utils from 'sk/utils'

/**
 * The SpriteSheet class handle multiple organized textures to form multiple 
 * sprites or animated sprites.
 *
 * Example:
 *
 *     let textures = {
 *       0: PIXI.Texture(url1),
 *       1: PIXI.Texture(url2),
 *       2: PIXI.Texture(url3)
 *       ...
 *     }
 *     let animations = {
 *       idle: {
 *         frames : [0, 1, 2],
 *         speed  : 1,
 *         repeat : true
 *       }
 *     }
 *     let spritesheet = new SpriteSheet()
 *     
 */
export default class SpriteSheet {

  /**
   * Constructor.
   *
   * @param {Object} textures - A map with <key: texture> pairs.
   * @param {Object} animations - A map with the <key: array> pairs, wheren the
   *        array contains a list of frames.
   * @param {Integer} frameRate - The animation framerate.
   */
  constructor(textures, animations, frameRate=20) {
    this._numFrames = 0
    this._textures = null
    this._animations = null
    this._frameRate = frameRate

    this.textures = textures
    if (animations) this.animations = animations
  }

  /**
   * The animation frame rate of this sprite sheet. This value is used to 
   * describe the default framerate of all animations in this class. The metric
   * is frames per seconds.
   * @type {Integer}
   */
  set frameRate(value) { this._frameRate = parseInt(value) }
  get frameRate() { return this._frameRate }

  /**
   * Map of textures in this object, can be an Array or an Object. If you are 
   * looking for a specific frame, use the `getFrame` method.
   * @type {Array<PIXI.Texture>|Object}
   */
  get textures() { return this._textures }
  set textures(value) {
    this._numFrames = Object.keys(value).length
    this._textures = value
  }

  /**
   * Map of animations. If you want to get a specific animation, use the 
   * `getAnimation` method.
   * @type {Array}
   */
  get animation() { return this._animations }
  set animations(value) {
    this._animations = value

    let keys = Object.keys(this._animations)
    for (let i=0; i<keys.length; i++) {
      let animation = this._animations[keys[i]]

      // Set `repeat` default
      if (typeof animation.repeat === 'undefined') {
        animation.repeat = true
      }
      animation.repeat = !!animation.repeat

      // Set `speed` default
      animation.speed = animation.speed || 1

      // Set `name`
      animation.name = keys[i]
    }
  }

  /**
   * The number of frames registered in this sprite sheet. Readonly.
   * @type {Integer}
   */
  get numFrames() {
    return this._numFrames
  }

  /**
   * Helper method to set a batch a variables to this object. Notice that, this
   * methods uses `Object.assign` internally, thus it only shallow copy the
   * input values. If you need a deep copy, check {@sk.utils.deepClone}.
   *
   * Example:
   *
   *     spritesheet.configure({frameRate:3, animations:{...}})
   *
   * @param {Object} config - The object containing the target variables.
   * @return {Sprite} This object.
   */
  configure(config) {
    Object.assign(this, config)
    return this
  }

  /**
   * Returns a specific frame texture by its name (or index).
   *
   * @param {Integer|String} name - The name or index of the frame.
   * @return {PIXI.Texture} The frame texture.
   */
  getFrame(name) {
    return this._textures[name]
  }

  /**
   * Returns an animation by its name.
   *
   * @param {String} name - The animation name.
   * @return {Object} The animation data.
   */
  getAnimation(name) {
    return this._animations? this._animations[name] : null
  }

  /**
   * Returns the first frame in this sprite sheet.
   *
   * @return {PIXI.Texture} The frame texture.
   */
  getFirstFrame() {
    let key = Object.keys(this._textures)[0]
    return this._textures[key]
  }

  /**
   * Returns the first animation in this sprite sheet.
   *
   * @return {PIXI.Texture} The animation data.
   */
  getFirstAnimation() {
    if (!this._animations) return

    let key = Object.keys(this._animations)[0]
    return this._animations[key] 
  }
}