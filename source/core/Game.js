import EventEmitter from 'core/EventEmitter'

import {gameDefaults, gameSchema} from 'config'

import * as utils from 'utils'
import * as managers from 'managers'

import {RENDERER} from 'globals_/constants'

/**
 * This class represent a Skald game and it is responsible for the
 * initialization of the canvas, aggregation and handling the managers and 
 * plugins, receiving global events and for the execution of the game loop. 
 */
export default class Game extends EventEmitter {

  /**
   * Creates a new game.
   * 
   * @param {Object} config - The initial configuration of the game.
   */
  constructor(config, manifest) {
    super()

    this._renderer = null
    this._stage = null
    this._parent = null
    this._config = null
    this._plugins = {}
    this._autoUpdate = true

    this._log = null

    // this._time = null
    this._events = null
    this._device = null
    this._display = null
    this._director = null
    this._sounds = null
    this._inputs = null
    this._keyboard = null
    this._mouse = null
    this._gamepads = null
    this._touches = null
    this._storage = null
    this._physics = null
    this._resources = null

    this._initialize(config, manifest)
  }

  /**
   * The PIXI renderer object. Readonly.
   * @type {PIXI.SystemRenderer}
   */
  get renderer() { return this._renderer }

  /**
   * The canvas object. Readonly.
   * @type {Canvas}
   */
  get view() { return this._renderer && this._renderer.view}

  /**
   * The game global container. Readonly.
   * @type {PIXI.Container}
   */
  get stage() { return this._stage }

  /**
   * The parent HTML element of this game. Readonly.
   * @type {HTTMLELement}
   */
  get parent() { return this._parent }

  /**
   * The configuration object, filtered and validated. Readonly.
   * @type {Object}
   */
  get config() { return this._config }


  get autoUpdate() { return this._autoUpdate }
  set autoUpdate(value) { this._autoUpdate = !!value }

  /**
   * The dict of plugins. Readonly.
   * @type {Object}
   */
  get plugins() { return this._plugins }

  /**
   * Logger. Readonly.
   * @type {Logger}
   */
  get log() { return this._log }

  /**
   * Time manager. Readonly.
   * @type {TimeManager}
   */
  get time() { return this._time }

  /**
   * Events manager. Readonly.
   * @type {EventsManager}
   */
  get events() { return this._events }

  /**
   * Device manager. Readonly.
   * @type {DeviceManager}
   */
  get device() { return this._device }

  /**
   * Display manager. Readonly.
   * @type {DisplayManager}
   */
  get display() { return this._display }

  /**
   * Director manager. Readonly.
   * @type {DirectorManager}
   */
  get director() { return this._director }

  /**
   * Sounds manager. Readonly.
   * @type {SoundsManager}
   */
  get sounds() { return this._sounds }

  /**
   * Inputs manager. Readonly.
   * @type {InputsManager}
   */
  get inputs() { return this._inputs }

  /**
   * Keyboard manager. Readonly.
   * @type {KeyboardManager}
   */
  get keyboard() { return this._keyboard }

  /**
   * Mouse manager. Readonly.
   * @type {MouseManager}
   */
  get mouse() { return this._mouse }

  /**
   * Gamepads manager. Readonly.
   * @type {GamepadsManager}
   */
  get gamepads() { return this._gamepads }

  /**
   * Touches manager. Readonly.
   * @type {TouchesManager}
   */
  get touches() { return this._touches }

  /**
   * Storage manager. Readonly.
   * @type {StorageManager}
   */
  get storage() { return this._storage }

  /**
   * Physics manager. Readonly.
   * @type {PhysicsManager}
   */
  get physics() { return this._physics }

  /**
   * Resources manager. Readonly.
   * @type {ResourcesManager}
   */
  get resources() { return this._resources }



  /**
   * Initialize all elements of the game.
   */
  _initialize(config, manifest) {
    utils.profiling.begin('boot')
    this._initializeConfig(config)
    this._initializeLogger()
    this._initializeRenderer()
    this._initializeManagers()
    // this._initializeLoader(manifest)
    this._initializeGame()
    utils.profiling.end('boot')
  }

  /**
   * Validate the configuration object and fill up missing config values with
   * default.
   */
  _initializeConfig(config) {
    utils.profiling.begin('config')

    this._config = utils.validateJson(config||{}, gameDefaults, gameSchema)
    this._autoUpdate = this._config.autoUpdate

    utils.profiling.end('config')
  }

  /**
   * Initialize and configure the game logger.
   */
  _initializeLogger() {
    utils.profiling.begin('logger')
    this._log = new utils.logging.Logger()
    this._log.level = this._config.logger.level
    this._log.setHandler(this._config.logger.handler)
    this._log.setFormatter(this._config.logger.formatter)
    utils.profiling.end('logger')
  }

  /**
   * Initialize the PIXI renderer
   */
  _initializeRenderer() {
    utils.profiling.begin('renderer')
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

    // enable focus on the game (and remove pixi interation)
    this._renderer.plugins.interaction.destroy()
    this._renderer.view.setAttribute('tabindex', '1')

    // add the renderer to the html
    this._parent.appendChild(this._renderer.view)

    // create the game global stage
    this._stage = new PIXI.Container()
    utils.profiling.end('renderer')
  }

  /**
   * Initialize the game managers
   */
  _initializeManagers() {
    utils.profiling.begin('managers')

    utils.profiling.begin('instatiation')
    this._time = new managers.TimeManager(this)
    this._events = new managers.EventsManager(this)
    this._device = new managers.DeviceManager(this)
    this._display = new managers.DisplayManager(this)
    // this._director = new managers.DirectorManager(this)
    // this._keyboard = new managers.KeyboardManager(this)
    // this._mouse = new managers.MouseManager(this)
    // this._gamepads = new managers.GamepadsManager(this)
    // this._touches = new managers.TouchesManager(this)
    // this._inputs = new managers.InputsManager(this)
    // this._resources = new managers.ResourcesManager(this)
    // this._sounds = new managers.SoundsManager(this)
    utils.profiling.end('instatiation')

    this._time.setup()
    this._events.setup()
    this._device.setup()
    this._display.setup()
    // this._resources.setup()
    // this._director.setup()
    // this._keyboard.setup()
    // this._mouse.setup()
    // this._gamepads.setup()
    // this._touches.setup()
    // this._inputs.setup()
    // this._sounds.setup()
    utils.profiling.end('managers')
  }

  /**
   * Load the manifest.
   */
  _initializeLoader(manifest) {
    utils.profiling.begin('loader')
    if (manifest) {
      this.resources.loadManifest(manifest)
    }
    utils.profiling.end('loader')
  }

  /**
   * Start the game
   */
  _initializeGame() {
    utils.profiling.begin('game')
    this._updateGame()
    utils.profiling.end('game')
  }

  /**
   * The game loop
   */
  _updateGame(overriddenDelta=0) {
    utils.profiling.begin('update')

    if (this._autoUpdate) {
      requestAnimationFrame(()=>this._updateGame())
    }
    
    utils.profiling.begin('preupdate')    
    this.time.preUpdate()
    let delta = overriddenDelta || this.time.delta

    // Pre update
    this.display.preUpdate(delta)
    // this.gamepads.preUpdate(delta)
    for (let name in this._plugins) {
      this._plugins[name].preUpdate(delta)
    }
    utils.profiling.end('preupdate')
    
    // Update
    utils.profiling.begin('update')
    for (let name in this._plugins) {
      this._plugins[name].update(delta)
    }
    
    // this._updateEntities(delta)
    this.events.update(delta)
    // this.director.update(delta)
    utils.profiling.end('update')

    // Post update
    utils.profiling.begin('postupdate')
    // this.keyboard.postUpdate(delta)
    // this.mouse.postUpdate(delta)
    // this.gamepads.postUpdate(delta)
    for (let name in this._plugins) {
      this._plugins[name].postUpdate(delta)
    }
    utils.profiling.end('postupdate')
    
    // Pre draw
    utils.profiling.begin('predraw')
    for (let name in this._plugins) {
      this._plugins[name].preDraw()
    }
    utils.profiling.end('predraw')

    // Draw
    utils.profiling.begin('draw')
    this._renderer.render(this._stage)

    for (let name in this._plugins) {
      this._plugins[name].draw()
    }
    utils.profiling.end('draw')

    utils.profiling.end('update')
  }

  /**
   * Temporary wordkaround to update the entities of the game. This is not 
   * called on the director because it must run before the event digest and the
   * scene update, however, it also part of the update phaser.
   */
  _updateEntities(delta) {
    let scene = this.director.currentScene

    if (scene && !this.director.inTransition()) {
      for (let entity of scene._entities) {
        if (entity.updatable) entity.update(delta)
      }
    }
  }

  step(delta=0.166666) {
    if (this._autoUpdate) return
      
    this._updateGame(delta)
  }

  /**
   * Register a plugin into the game.
   */
  addPlugin(plugin) {
    plugin = utils.tryToInstantiate(plugin, this)

    if (!plugin) {
      throw new Error(`You must provide a plugin.`)
    }

    if (!plugin.name) {
      throw new Error(`Trying to add a plugin without a name.`)
    }

    if (this._plugins[plugin.name]) {
      throw new Error(`Trying to add a plugin with the same name of one `+
                      `already registered.`)
    }

    this._plugins[plugin.name] = plugin
  }

  /**
   * Remove plugin.
   */
  removePlugin(pluginOrName) {
    if (!pluginOrName) {
      throw new Error(`You must provide a plugin or a plugin name to `+
                      `remove it from the game.`)
    }

    // remove the behavior by key
    if (typeof pluginOrName === 'string') {
      delete this._plugins[pluginOrName]

    // remove plugin by object
    } else {
      let plugins = this._plugins
      let names = Object.keys(plugins)
      let name = names.find(key => plugins[key] === pluginOrName)

      if (name) delete this._plugins[name]
    }
  }

  /**
   * Verify if this game has an plugin by its name.
   *
   * @param {String} pluginName - The name of the plugin.
   * @return {Boolean} Whether this game has the plugin or not.
   */
  hasPlugin(pluginName) {
    return !!this._plugins[pluginName]
  }
}