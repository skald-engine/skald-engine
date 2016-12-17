import EventEmitter from 'core/EventEmitter'

/**
 * This class represent a Skald game, and it is responsible for the
 * initialization of the canvas, aggregate and handle the managers and plugins,
 * receive global events and for the execution of the game loop.
 *
 * 
 */
export default class Game extends EventEmitter {
  constructor() {
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
  }
}