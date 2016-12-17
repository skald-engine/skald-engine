import EventEmitter from 'core/EventEmitter'

import gameDefaults from 'core/config/gameDefaults'
import gameSchema from 'core/config/gameSchema'

import * as utils from 'utils'
import {RENDERER} from 'core/constants'

/**
 * This class represent a Skald game, and it is responsible for the
 * initialization of the canvas, aggregate and handle the managers and plugins,
 * receive global events and for the execution of the game loop.
 *
 * 
 */
export default class Game extends EventEmitter {

  /**
   * Creates a new game.
   * 
   * @param {Object} config - The initial configuration of the game.
   */
  constructor(config) {
    super()

    this._renderer = null
    this._stage = null
    this._parent = null
    this._config = null
    this._plugins = null

    this.log = null

    this.time = null
    this.event = null
    this.device = null
    this.display = null
    this.director = null
    this.sound = null
    this.input = null
    this.keyboard = null
    this.mouse = null
    this.gamepad = null
    this.touch = null
    this.storage = null
    this.physics = null
    this.resource = null

    this._initialize(config)
  }

  /**
   * Initialize all elements of the game.
   */
  _initialize(config) {
    this._initializeConfig(config)
    this._initializeLogger()
    this._initializeRenderer()
    this._initializeManagers()
    this._initializeGame()
  }

  /**
   * Validate the configuration object and fill up missing config values with
   * default.
   */
  _initializeConfig(config) {
    this._config = utils.validateJson(config||{}, gameDefaults, gameSchema)
  }

  /**
   * Initialize and configure the game logger.
   */
  _initializeLogger() {
    this.log = new utils.logging.Logger()
    this.log.level = this._config.logger.level
    this.log.setHandler(this._config.logger.handler)
    this.log.setFormatter(this._config.logger.formatter)
  }

  /**
   * Initialize the PIXI renderer
   */
  _initializeRenderer() {
    // ge parent element
    this._parent = document.body
    if (this._config.parent) {
      this._parent = document.getElementById(this._config.parent)
    }

    // get the proper pixi renderer
    let renderers = {
      [RENDERER.AUTO]   : PIXI.autoDetectRenderer,
      [RENDERER.WEBGL]  : PIXI.CanvasRenderer,
      [RENDERER.CANVAS] : PIXI.WebGLRenderer,
    }

    // create the pixi renderer
    let display = this._config.display
    this._renderer = new renderers[display.renderer](
      display.width,
      display.height,
      {
        resolution      : display.resolution,
        backgroundColor : display.backgroundColor,
        antialias       : display.antialias,
        transparent     : display.transparent,
        forceFXAA       : display.forceFXAA,
        roundPixels     : display.roundPixels,
      }
    )

    // add the renderer to the html
    this._parent.appendChild(this._renderer.view)

    // create the game global stage
    this._stage = new PIXI.Container()
  }

  /**
   * Initialize the game managers
   */
  _initializeManagers() {}

  /**
   * Start the game
   */
  _initializeGame() {}

  /**
   * The game loop
   */
  _updateGame() {
    requestAnimationFrame(()=>this._updateGame())

    this._renderer.render(this._stage)
  }
}