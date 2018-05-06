const $ = require('sk/$')
const Manager = require('sk/core/Manager')
const C = require('sk/constants')

class DisplayManager extends Manager {
  constructor() {
    super()

    // internal use
    this._pendingResize = false
    this._inWrongOrientation = false
    this._beforeFullscreenWidth = null
    this._beforeFullscreenHeight = null
    this._fullscreenRequest = null
    this._fullscreenCancel = null

    this._device = null
    this._logger = null
    this._renderer = null
    this._config = null
    this._stage = null
    this._profile = null

    // internal due to getter access
    this._width = null
    this._height = null
    this._canvasWidth = null
    this._canvasHeight = null
    this._scaleMode = null
    this._fullscreenScaleMode = null
    this._forceOrientation = null

    // signals
    this._resizeSignal = null
    this._enterWrongOrientationSignal = null
    this._leaveWrongOrientationSignal = null
    this._enterFullscreenSignal = null
    this._leaveFullscreenSignal = null
    this._fullscreenChanceSignal = null
    this._orientationChanceSignal = null
  }

  /**
   * Returns the **current** game width. Readonly.
   * @type {Number}
   */
  get width() { return this._width }

  /**
   * Returns the **current** game height. Readonly.
   * @type {Number}
   */
  get height() { return this._height }

  /**
   * Returns the half of the current game width. Readonly.
   * @type {Number}
   */
  get halfWidth() { return this._width/2 }

  /**
   * Returns the half of the current game height. Readonly.
   * @type {Number}
   */
  get halfHeight() { return this._height/2 }

  /**
   * Returns the canvas width, which can be different from width due to 
   * auto scaling. Readonly.
   * @type {Number}
   */
  get canvasWidth() { return this._canvasWidth }

  /**
   * Returns the canvas height, which can be different from height due 
   * to auto scaling. Readonly.
   * @type {Number}
   */
  get canvasHeight() { return this._canvasHeight }
  
  /**
   * Returns the game orientation. This is computed using the window height
   * and width. Readonly.
   * @type {ORIENTATIONS}
   */
  get orientation() {
    let clientWidth = window.innerWidth ||
                      document.documentElement.clientWidth
                      document.body.clientWidth
    let clientHeight = window.innerHeight ||
                       document.documentElement.clientHeight ||
                       document.body.clientHeight

    if (clientWidth > clientHeight) {
      return C.ORIENTATIONS.LANDSCAPE 
    } else {
      return C.ORIENTATIONS.PORTRAIT
    }
  }

  /**
   * The auto scale mode of the game.
   * @type {SCALE_MODES}
   */
  get scaleMode() { return this._scaleMode }
  set scaleMode(mode) {
    if (!C.SCALE_MODES(mode)) {
      throw new Error(`Invalid scale mode "${mode}".`)
    }
    
    this._scaleMode = mode
    this._pendingResize = true
  }

  /**
   * The auto scale mode for when the game is fullscreen.
   * @type {SCALE_MODES}
   */
  get fullscreenScaleMode() { return this._fullscreenScaleMode }
  set fullscreenScaleMode(mode) {
    if (!C.SCALE_MODES(mode)) {
      throw new Error(`Invalid fullscreen scale mode "${mode}."`)
    }
    
    this._fullscreenScaleMode = mode
    this._pendingResize = true
  }

  /**
   * Which orientation must be enforced by the game. If there is no restriction
   * of orientation, this value is `null`.
   * @type {null|ORIENTATIONS}
   */
  get forceOrientation() { return this._forceOrientation }
  set forceOrientation(orientation) {
    if (orientation !== null && !C.ORIENTATIONS(orientation)) {
      throw new Error(`Invalid orientation "${orientation}".`)
    }
    this._forceOrientation = orientation
  }

  /**
   * The current canvas resolution.
   * @type {Number}
   */
  get resolution() { return this._renderer.resolution }
  set resolution(value) {
    this._renderer.resolution = value
    this._pendingResize = true
  }

  /**
   * Canvas transparency.
   * @type {Boolean}
   */
  get transparent() { return this._renderer.transparent }
  set transparent(value) { this._renderer.transparent = value }

  /**
   * Canvas backgorund color.
   * @type {String}
   */
  get backgroundColor() { return this._renderer.backgroundColor }
  set backgroundColor(value) { this._renderer.backgroundColor = value }

  /**
   * Whether the canvas should round pixels or not.
   * @type {Boolean}
   */
  get roundPixels() { return this._renderer.roundPixels }
  set roundPixels(value) { this._renderer.roundPixels = value }

  /**
   * Check or set the game fullscreen mode.
   */
  get fullscreen() {
    return !!(document['fullscreenElement'] ||
              document['webkitFullscreenElement'] ||
              document['mozFullScreenElement'] ||
              document['msFullscreenElement'])
  }
  set fullscreen(value) {
    // enter fullscreen
    if (value) {
      if (!this._device.fullscreen) {
        this._logger.error(`Trying to enter fullscren but device does not `+
                           `support this operation. Ignoring command.`)
        return false
      }
      if (this.fullscreen) return false

      this._beforeFullscreenWidth = this._width
      this._beforeFullscreenHeight = this._height
      this._renderer.view[this._fullscreenRequest]()
      return true

    // Leave fullscreen
    } else {
      if (!this._device.fullscreen) {
        this._logger.error(`Trying to leave fullscren but device does not `+
                           `support this operation. Ignoring command.`)
        return false
      }
      if (!this.fullscreen) return false

      this._width = this._beforeFullscreenWidth
      this._height = this._beforeFullscreenHeight
      document[this._fullscreenCancel]()
      return true
    }
  }

  setup() {
    let injector = $.getInjector()

    this._config = injector.resolve('config')
    this._device = injector.resolve('device')
    this._logger = injector.resolve('logger')
    this._renderer = injector.resolve('renderer')
    this._stage = injector.resolve('stage')
    this._profile = injector.resolve('profile')
    this._resizeSignal = injector.resolve('resizeSignal')
    this._enterWrongOrientationSignal = injector.resolve('enterWrongOrientationSignal')
    this._leaveWrongOrientationSignal = injector.resolve('leaveWrongOrientationSignal')
    this._enterFullscreenSignal = injector.resolve('enterFullscreenSignal')
    this._leaveFullscreenSignal = injector.resolve('leaveFullscreenSignal')
    this._fullscreenChanceSignal = injector.resolve('fullscreenChangeSignal')
    this._orientationChanceSignal = injector.resolve('orientationChangeSignal')


    this._profile.begin('display')
    this._setupVariables()
    this._setupFullscreen()
    this._setupEvents()

    this._checkOrientation()
    this._doResize()
    this._profile.end('display')
  }

  /**
   * Manager pre update. Called internally by the engine. Do not call it 
   * manually.
   */
  preUpdate() {
    if (this._pendingResize) {
      this._doResize()
    }
  }

  /**
   * Setup the internal variables accordingly to the game config.
   */
  _setupVariables() {
    this._width = this._config.get('display.width')
    this._height = this._config.get('display.height')
    this._canvasWidth = this._config.get('display.width')
    this._canvasHeight = this._config.get('display.height')
    this._scaleMode = this._config.get('display.scaleMode')
    this._fullscreenScaleMode = this._config.get('display.fullscreenScaleMode')
    this._forceOrientation = this._config.get('display.forceOrientation')
  }

  /**
   * Setup the fullscreen requests.
   */
  _setupFullscreen() {
    if (!this._device.fullscreen) return

    let requestGuesses = [
      'requestFullscreen',       'requestFullScreen',
      'webkitRequestFullscreen', 'webkitRequestFullScreen',
      'msRequestFullscreen',     'msRequestFullScreen',
      'mozRequestFullScreen',    'mozRequestFullscreen'
    ]
    let cancelGuesses = [
      'cancelFullScreen',       'exitFullscreen',
      'webkitCancelFullScreen', 'webkitExitFullscreen',
      'msCancelFullScreen',     'msExitFullscreen',
      'mozCancelFullScreen',    'mozExitFullscreen'
    ]

    let element = this._renderer.view
    this._fullscreenRequest = requestGuesses.find(r=>element[r])
    this._fullscreenCancel = cancelGuesses.find(c=>document[c])
  }

  /**
   * Setup the listener browser events related to fullscreen, orientation and 
   * sizing changes.
   */
  _setupEvents() {
    let fullscreenEvent = e=>this._onFullscreenChange(e)
    document.addEventListener('webkitfullscreenchange', fullscreenEvent, false)
    document.addEventListener('mozfullscreenchange', fullscreenEvent, false)
    document.addEventListener('MSFullscreenChange', fullscreenEvent, false)
    document.addEventListener('fullscreenchange', fullscreenEvent, false)

    let resizeEvent = e=>this._onResize(e)
    window.addEventListener('resize', resizeEvent, false)

    let orientationEvent = e=>this._onOrientationChange(e)
    window.addEventListener('deviceorientation', orientationEvent, false)
  }

  /**
   * Apply any pending resing, and compute the new values of the display.
   */
  _doResize() {
    this._pendingResize = false

    // Variables
    let width = this._width
    let height = this._height
    let clientWidth = window.innerWidth ||
                      document.documentElement.clientWidth
                      document.body.clientWidth
    let clientHeight = window.innerHeight ||
                       document.documentElement.clientHeight ||
                       document.body.clientHeight

    let stagePositionX = 0
    let stagePositionY = 0
    let stageScaleX = this._stage.scale.x
    let stageScaleY = this._stage.scale.y
    let scaleMode = this._scaleMode

    if (this.fullscreen) {
      scaleMode = this._fullscreenScaleMode
    }


    if (scaleMode === C.SCALE_MODES.NOSCALE) {
      stageScaleX = 1
      stageScaleY = 1
      this._canvasWidth = this._width
      this._canvasHeight = this._height
    }

    else if (scaleMode === C.SCALE_MODES.STRETCH) {
      stageScaleX = clientWidth/width
      stageScaleY = clientHeight/height
      this._canvasWidth = clientWidth
      this._canvasHeight = clientHeight
    }

    else if (scaleMode === C.SCALE_MODES.FIT) {
      let ratio = Math.min(clientWidth/width, clientHeight/height)
      stageScaleX = ratio
      stageScaleY = ratio
      this._canvasWidth = width*ratio
      this._canvasHeight = height*ratio
    }

    else if (scaleMode === C.SCALE_MODES.FILL) {
      let ratio = Math.max(clientWidth/width, clientHeight/height)
      stageScaleX = ratio
      stageScaleY = ratio
      stagePositionX = (clientWidth - width*ratio)/2
      stagePositionY = (clientHeight - height*ratio)/2
      this._canvasWidth = clientWidth
      this._canvasHeight = clientHeight
    }

    this._stage.position.x = stagePositionX
    this._stage.position.y = stagePositionY
    this._stage.scale.x = stageScaleX
    this._stage.scale.y = stageScaleY
    this._renderer.resize(this._canvasWidth, this._canvasHeight)
    this._renderer.view.style.width = this._canvasWidth+'px'
    this._renderer.view.style.height = this._canvasHeight+'px'

    this._resizeSignal.dispatch(width, height)
  }

  /**
   * Check the device and window orientation, dispatching orientation events
   * and checking for wrong orientation.
   */
  _checkOrientation(a, b, g) {
    if (this._device.desktop) return

    let o = this.orientation

    // Wrong orientation
    let inWrongOrientation = this._forceOrientation && 
                             this.orientation !== this._forceOrientation

    if (!this._inWrongOrientation && inWrongOrientation) {
      this._enterWrongOrientationSignal.dispatch(o, a, b, g)

    } else if (this._inWrongOrientation && !inWrongOrientation) {
      this._leaveWrongOrientationSignal.dispatch(o, a, b, g)
    }

    this._inWrongOrientation = inWrongOrientation
  }
  /**
   * Callback for browser fullscreen event.
   */
  _onFullscreenChange(browserEvent) {
    this._fullscreenChangeSignal.dispatch()

    if (this.fullscreen) {
      this._enterFullscreenChangeSignal.dispatch()
    } else {
      this._leaveFullscreenChangeSignal.dispatch()
    }
  }

  /**
   * Callback for browser resize event.
   */
  _onResize(browserEvent) {
    this._doResize()
  }

  /**
   * Callback for browser orientation event.
   */
  _onOrientationChange(browserEvent) {
    if (this._device.desktop) return

    this._orientationChanceSignal.dispatch(o, a, b, g)
    this._checkOrientation(a, b, g)
  }


  /**
   * Resize the game.
   *
   * @param {Number} width - The new game width.
   * @param {Number} height - The new game height.
   * @return {Boolean} whether the resizing will be happening or not.
   */
  resize(width, height) {
    if (width <= 0) {
      this._logger.error(`Trying to resize the game with an invalid width `+
                         `"${width}". Ignoring command.`)
      return false
    }

    if (height <= 0) {
      this._logger.error(`Trying to resize the game with an invalid height `+
                         `"${height}". Ignoring command.`)
      return false

    }

    this._width = width
    this._height = height
    this._pendingResize = true

    return true
  }

  /**
   * Toggle fullscreen. Shortcut for `display.fullscreen = !display.fullscreen`.
   * 
   * @return {Boolean} whether the fullscreen will be happening or not.
   */
  toggleFullscreen() {
    return this.fullscreen = !this.fullscreen
  }

  /**
   * Check if game is in the correct orientation (if orientation is enforced).
   * Notice that desktop is always on correct orientation.
   * 
   * @return {Boolean} whether the game is in correct orientation.
   */
  isCorrectOrientation() {
    if (this._device.desktop) return true

    return !this._forceOrientation ||
           this._forceOrientation === this.orientation
  }
}

module.exports = DisplayManager