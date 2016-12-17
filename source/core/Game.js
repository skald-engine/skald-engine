import EventEmitter from 'core/EventEmitter'

import gameDefaults from 'core/config/gameDefaults'
import gameSchema from 'core/config/gameSchema'

import * as utils from 'utils'

/**
 * This class represent a Skald game, and it is responsible for the
 * initialization of the canvas, aggregate and handle the managers and plugins,
 * receive global events and for the execution of the game loop.
 *
 * 
 */
export default class Game extends EventEmitter {
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

  _initialize(config) {
    this._initializeConfig(config)
    this._initializeLogger()
    this._initializeRenderer()
    this._initializeManagers()
    this._initializeGame()
  }
  _initializeConfig(config) {
    this._config = utils.validateJson(config||{}, gameDefaults, gameSchema)
  }
  _initializeLogger() {
    this.log = new utils.logging.Logger()
    this.log.level = this._config.logger.level
    this.log.setHandler(this._config.logger.handler)
    this.log.setFormatter(this._config.logger.formatter)
  }
  _initializeRenderer() {}
  _initializeManagers() {}
  _initializeGame() {}

  _updateGame() {}
}