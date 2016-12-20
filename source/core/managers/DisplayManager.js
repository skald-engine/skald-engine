import {ORIENTATION, SCALE_MODE} from 'core/constants'
import Manager from 'core/Manager' 
import Event from 'core/events/Event' 
import OrientationEvent from 'core/events/OrientationEvent' 

/**
 * The manager of the display settings and variables of the game. This class 
 * handles manual resizing, automatic resizing, fullscreen and fullscreen 
 * resizing, and orientation changes and enforcing. 
 *
 * Notice that most changes performed in this display won't apply immediately.
 * Instead, it will wait for the next tick to apply the modifications.
 *
 * If you need more control than what is provided by this manager, you may 
 * access `game._renderer` (the PIXI renderer object).
 */
export default class DisplayManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    // internal use
    this._pendingResize = false
    this._inWrongOrientation = false
    this._originalWidth = null
    this._originalHeight = null
    this._beforeFullscreenWidth = null
    this._beforeFullscreenHeight = null
    this._fullscreenRequest = null
    this._fullscreenCancel = null

    // internal due to getter access
    this._width = null
    this._height = null
    this._scaleMode = null
    this._fullscreenScaleMode = null
    this._forceOrientation = null
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
   * Returns the game orientation. This is computed using the window height
   * and width. Readonly.
   * @type {ORIENTATION}
   */
  get orientation() {
    let clientWidth = window.innerWidth ||
                      document.documentElement.clientWidth
                      document.body.clientWidth
    let clientHeight = window.innerHeight ||
                       document.documentElement.clientHeight ||
                       document.body.clientHeight

    if (clientWidth > clientHeight) {
      return ORIENTATION.LANDSCAPE 
    } else {
      return ORIENTATION.PORTRAIT
    }
  }

  /**
   * The auto scale mode of the game.
   * @type {SCALE_MODE}
   */
  get scaleMode() { return this._scaleMode }
  set scaleMode(mode) {
    if (!SCALE_MODE(mode)) {
      throw Error(`Invalid scale mode "${mode}".`)
    }
    
    this._scaleMode = mode
    this._pendingResize = true
  }

  /**
   * The auto scale mode for when the game is fullscreen.
   * @type {SCALE_MODE}
   */
  get fullscreenScaleMode() { return this._fullscreenScaleMode }
  set fullscreenScaleMode(mode) {
    if (!SCALE_MODE(mode)) {
      throw Error(`Invalid fullscreen scale mode "${mode}."`)
    }
    
    this._fullscreenScaleMode = mode
    this._pendingResize = true
  }

  /**
   * Which orientation must be enforced by the game. If there is no restriction
   * of orientation, this value is `null`.
   * @type {null|ORIENTATION}
   */
  get forceOrientation() { return this._forceOrientation }
  set forceOrientation(orientation) {
    if (orientation !== null && !ORIENTATION(orientation)) {
      throw Error(`Invalid orientation "${orientation}".`)
    }
    this._forceOrientation = orientation
  }

  /**
   * The current canvas resolution.
   * @type {Number}
   */
  get resolution() { return this.game._renderer.resolution }
  set resolution(value) {
    this.game._renderer.resolution = value
    this._pendingResize = true
  }

  /**
   * Canvas transparency.
   * @type {Boolean}
   */
  get transparent() { return this.game._renderer.transparent }
  set transparent(value) { this.game._renderer.transparent = value }

  /**
   * Canvas backgorund color.
   * @type {String}
   */
  get backgroundColor() { return this.game._renderer.backgroundColor }
  set backgroundColor(value) { this.game._renderer.backgroundColor = value }

  /**
   * Whether the canvas should round pixels or not.
   * @type {Boolean}
   */
  get roundPixels() { return this.game._renderer.roundPixels }
  set roundPixels(value) { this.game._renderer.roundPixels = value }


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
      if (!this.game.device.fullscreen) {
        this.game.log.error(`Trying to enter fullscren but device does not `+
                            `support this operation. Ignoring command.`)
        return false
      }
      if (this.fullscreen) return false

      this._beforeFullscreenWidth = this._width
      this._beforeFullscreenHeight = this._height
      this.game._renderer.view[this._fullscreenRequest]()
      return true

    // Leave fullscreen
    } else {
      if (!this.game.device.fullscreen) {
        this.game.log.error(`Trying to leave fullscren but device does not `+
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


  /**
   * Manager setup. Called internally by the engine. Do not call it manually.
   */
  setup() {
    this._setupVariables()
    this._setupFullscreen()
    this._setupEvents()

    this._checkOrientation()
    this._doResize()
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
    let config = this.game._config

    this._width = config.display.width
    this._height = config.display.height
    this._originalWidth = config.display.width
    this._originalHeight = config.display.height
    this._scaleMode = config.display.scaleMode
    this._fullscreenScaleMode = config.display.fullscreenScaleMode
    this._forceOrientation = config.display.forceOrientation
  }

  /**
   * Setup the fullscreen requests.
   */
  _setupFullscreen() {
    if (!this.game.device.fullscreen) return

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

    let element = this.game._renderer.view
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
    let width = this._originalWidth
    let height = this._originalHeight
    let clientWidth = window.innerWidth ||
                      document.documentElement.clientWidth
                      document.body.clientWidth
    let clientHeight = window.innerHeight ||
                       document.documentElement.clientHeight ||
                       document.body.clientHeight

    let stagePositionX = 0
    let stagePositionY = 0
    let stageScaleX = this.game._stage.scale.x
    let stageScaleY = this.game._stage.scale.y
    let scaleMode = this._scaleMode

    if (this.fullscreen) {
      scaleMode = this._fullscreenScaleMode
    }


    if (scaleMode === SCALE_MODE.NOSCALE) {
      stageScaleX = 1
      stageScaleY = 1
    }

    else if (scaleMode === SCALE_MODE.STRETCH) {
      stageScaleX = clientWidth/width
      stageScaleY = clientHeight/height
      this._width = clientWidth
      this._height = clientHeight
    }

    else if (scaleMode === SCALE_MODE.FIT) {
      let ratio = Math.min(clientWidth/width, clientHeight/height)
      stageScaleX = ratio
      stageScaleY = ratio
      this._width = width*ratio
      this._height = height*ratio
    }

    else if (scaleMode === SCALE_MODE.FILL) {
      let ratio = Math.min(clientWidth/width, clientHeight/height)

      stageScaleX = ratio
      stageScaleY = ratio
      stagePositionX = (clientWidth - width*ratio)/2
      stagePositionY = (clientHeight - height*ratio)/2
      this._width = clientWidth
      this._height = clientHeight
    }

    this.game._stage.position.x = stagePositionX
    this.game._stage.position.y = stagePositionY
    this.game._stage.scale.x = stageScaleX
    this.game._stage.scale.y = stageScaleY
    this.game._renderer.resize(this._width, this._height)
    this.game._renderer.view.style.width = this._width+'px'
    this.game._renderer.view.style.height = this._height+'px'

    // TODO ENABLE THIS: this.game.event.dispatchToScene(new Event('resize'))
  }

  /**
   * Check the device and window orientation, dispatching orientation events
   * and checking for wrong orientation.
   */
  _checkOrientation(a, b, g) {
    if (this.game.device.desktop) return

    let o = this.orientation

    // Wrong orientation
    let inWrongOrientation = this._forceOrientation && this.orientation !== this._forceOrientation
    if (!this._inWrongOrientation && inWrongOrientation) {
      // TODO ENABLE THIS: this.game.event.dispatchToScene(new OrientationEvent('wrongorientationenter', o, a, b, g))
    } else if (this._inWrongOrientation && !inWrongOrientation) {
      // TODO ENABLE THIS: this.game.event.dispatchToScene(new OrientationEvent('wrongorientationleave', o, a, b, g))
    }

    this._inWrongOrientation = inWrongOrientation
  }

  /**
   * Callback for browser fullscreen event.
   */
  _onFullscreenChange(browserEvent) {
    // TODO ENABLE THIS: this.game.event.dispatchToScene(new Event('fullscreenchange'))

    if (this.fullscreen) {
      // TODO ENABLE THIS: this.game.event.dispatchToScene(new Event('fullscreenenter'))
    } else {
      // TODO ENABLE THIS: this.game.event.dispatchToScene(new Event('fullscreenleave'))
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
    if (this.game.device.desktop) return

    let a = browserEvent.alpha
    let b = browserEvent.beta
    let g = browserEvent.gamma
    let o = this.orientation

    // Orientation change
    // TODO ENABLE THIS: this.game.event.dispatchToScene(new OrientationEvent('orientationchange', o, a, b, g))

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
      this.game.log.error(`Trying to resize the game with an invalid width `+
                      `"${width}". Ignoring command.`)
      return false
    }

    if (height <= 0) {
      this.game.log.error(`Trying to resize the game with an invalid height `+
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
    if (this.game.device.desktop) return true

    return !this._forceOrientation ||
           this._forceOrientation === this.orientation
  }
}