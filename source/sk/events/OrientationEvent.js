import Event from 'sk/events/Event'

/**
 * Specific event class to represent changes on the orientation. This event
 * follows the structure of the browser [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent).
 */
export default class OrientationEvent extends Event {

  /**
   * @param {String} type - The name of the event.
   * @param {ORIENTATION} orientation - The device current orientation.
   * @param {Number} alpha - The alpha of the device orientation (see below 
   *        for more information).
   * @param {Number} beta - The beta of the device orientation (see below 
   *        for more information).
   * @param {Number} gamma - The gamma of the device orientation (see below 
   *        for more information).
   * @param {Boolean} [cancelable=true] - Whether if this event may be canceled
   *        from bubbling or not.
   */
  constructor(type, orientation, alpha, beta, gamma, cancelable=true) {
    super(type, cancelable)
    
    this._orientation = orientation
    this._alpha       = alpha
    this._beta        = beta
    this._gamma       = gamma
  }

  /**
   * The device orientation. Notice that this is computed using the window 
   * width and height, rather than using the device rotation values. Readonly.
   * @type {ORIENTATION}
   */
  get orientation() { return this._orientation }

  /**
   * A number representing the motion of the device around the z axis, express
   * in degrees with values ranging from 0 to 360. Readonly.
   * @type {Number}
   */
  get alpha() { return this._alpha }

  /**
   * A number representing the motion of the device around the x axis, express
   * in degrees with values ranging from -180 to 180. This represents a front
   * to back motion of the device. Readonly.
   * @type {Number}
   */
  get beta() { return this._beta }

  /**
   * A number representing the motion of the device around the y axis, express
   * in degrees with values ranging from -90 to 90. This represents a left to
   * right motion of the device. Readonly.
   * @type {Number}
   */
  get gamma() { return this._gamma }

  reset() {
    super.reset()
    this._orientation = null
    this._alpha = null
    this._beta = null
    this._gamma = null
  }
}