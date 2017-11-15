const Manager = require('sk/core/Manager')
const ResourceEvent = require('sk/events/ResourceEvent')
const ProgressEvent = require('sk/events/ProgressEvent')
const ErrorEvent = require('sk/events/ErrorEvent')

const Resource = require('sk/core/Resource')
const middlewares = require('sk/middlewares')

const utils = require('sk/utils')



/**
 * Resources manager handle the loading and caching of the game assets.
 *
 * Internally, this manager uses the PIXI builtin loader 
 * (see https://github.com/englercj/resource-loader).
 */
class ResourcesManager extends Manager {

  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    // The instance to the PIXI loader
    this._loader = null

    // List of all resources by ID (used to get the resources by the user)
    this._resourcesById = {}

    // List of all resources by url (used to check the cache)
    this._resourcesByUrl = {}

    // List of middlewares
    this._middlewares = {}
    
    // Amount of resources in queued to be loaded
    this._queueSize = 0
  }

  /**
   * Bash path that will be used for all resources during loading.
   * @type {String}
   */
  get basePath() { return this._loader.baseUrl }
  set basePath(value) { this._loader.baseUrl = value }

  /**
   * Maximum number of concurrent loading process. Readonly.
   * @type {Number}
   */
  get maxConcurrency() { return this._loader._queue.concurrency }


  /**
   * Manager setup. Called internally by the engine. Do not call it manually.
   */
  setup() {
    utils.profiling.begin('resources')
    this._setupLoader()
    this._setupMiddlewares()
    this._setupEvents()
    utils.profiling.end('resources')
  }

  /**
   * Setup the PIXI loader.
   */
  _setupLoader() {
    let config = this.game.config
    let basePath = config.resources.basePath || ''
    let maxConcurrency = config.resources.maxConcurrency
    this._loader = new PIXI.loaders.Loader(basePath, maxConcurrency)
  }

  /**
   * Setup the loader middlewares.
   */
  _setupMiddlewares() {
    // remove the current middlewares from the pixi loader. We don't change 
    // the Load._pixiMiddleware variable to avoid any conflit with non-skald 
    // pixi game running in the same page.
    this._loader._afterMiddleware = []

    // Middleware to convert the pixi resource to skald resource
    this._loader.use((resource, next) => {
      resource.skaldResource = new Resource(
        resource.metadata.type,
        resource.name,
        resource.url,
        resource.xhrType,
        resource.data,
        resource.metadata.metadata,
        resource
      )
      next();
    })

    // Add all other middlewares
    this.useMiddleware('raw', middlewares.RawMiddleware)
    this.useMiddleware('json', middlewares.JsonMiddleware)
  }

  /**
   * Configure the PIXI loader events.
   */
  _setupEvents() {
    this._loader.on('progress', (l, r) => this._onProgress(l, r))
    this._loader.on('error', (e, l, r) => this._onError(e, l, r))
    this._loader.on('load', (l, r) => this._onLoad(l, r))
    this._loader.on('complete', () => this._onComplete())
  }

  /**
   * Handle progress event.
   */
  _onProgress(loader, pixiResource) {
    let total = this._queueSize
    let loaded = parseInt(this._queueSize*loader.progress/100)
    
    let event = this.game.pool.create(ProgressEvent)
    event._type = 'resources.progress'
    event._loaded = loaded
    event._total = total
    this.game.events.dispatch(event)
  }
  
  /**
   * Handle error event.
   */
  _onError(error, loader, pixiResource) {
    let event = this.game.pool.create(ErrorEvent)
    event._type = 'resources.error'
    event._message = `Could not load the resource "${pixiResource.name}" `+
                     `from "${pixiResource.url}".`
    this.game.events.dispatch(event)

    this.game.log.warn(
      `Could not load the resource "${pixiResource.name}" from `+
      `"${pixiResource.url}" due to: ${error}`
    )
  }

  /**
   * Handle load event.
   */
  _onLoad(loader, pixiResource) {
    let resource = this._resourcesById[pixiResource.name] || {}
    
    let event = this.game.pool.create(ResourceEvent)
    event._type = 'resources.load'
    event._id = resource.id
    event._url = resource.url
    event._resource = resource
    this.game.events.dispatch(event)

    this.game.log.trace(`(resources) Resource "${resource.id}" loaded `+
                        `sucessfully.`)
  }
  
  /**
   * Handle complete event.
   */
  _onComplete(event) {
    this.game.events.dispatch('resources.complete')
    this._queueSize = 0
    this._loader.reset()
  }

  /**
   * Register and store a resource for future usage.
   *
   * @param {sk.core.Resource} Resource - The resource item.
   */
  cacheResource(resource) {
    this._resourcesById[resource.id] = resource
    this._resourcesByUrl[resource.url] = resource
  }

  /**
   * Adds a new middleware to the manager. 
   *
   * @param {String} type - The resource type, must be unique.
   * @param {sk.core.Middleware} Middleware - A class that inherit from skald
   *        Middleware.
   */
  useMiddleware(type, Middleware) {
    // Error if duplicated types
    if (this._middlewares[type]) {
      throw new Error(`There is already another middleware registered for `+
                      `type "${type}".`)
    }

    // Register on PIXI loader
    let middleware = new Middleware(this.game, type)
    this._loader.use((resource, next) => {
      middleware.run(resource)
      next()
    })

    // Register middleware here
    this._middlewares[type] = middleware
  }

  /**
   * Start the loading.
   */
  load() {
    this._queueSize = this._loader._queue._tasks.length
    this._loader.load()
  }

  /**
   * Returns a list of all resources by ID.
   *
   * @return {Array<String>} The array with resource IDs.
   */
  list() {
    return Object.keys(this._resourcesById)
  }

  /**
   * Returns a resource object by its ID.
   *
   * @param {String} id - The resource ID.
   * @return {Object} The resource object.
   */
  get(id) {
    let resource = this._resourcesById[id]
    if (resource) {
      return resource.object
    }
  }

  /**
   * Returns the URL for a given resource ID.
   *
   * @param {String} id - The resource ID.
   * @return {String} The resource URL.
   */
  getUrl(id) {
    let resource = this._resourcesById[id]
    if (resource) {
      return resource.url
    }
  }

  /**
   * Returns the raw metadata for a given resource (i.e., the metadata is the
   * object provided by the user or create internally by the Skald).
   *
   * @param {String} id - The resource ID.
   * @return {Object} The raw metadata.
   */
  getMetadata(id) {
    let resource = this._resourcesById[id]
    if (resource) {
      return resource.metadata
    }
  }
  
  /**
   * Loads a generic file without any processing or convertion.
   *
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addRaw(id, url) {
    if (!id || !url) {
      throw new TypeError(`You must provide an ID and an URL.`)
    }

    this.game.log.trace(`(resources) Loading raw "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'raw'}})
  }

  
  /**
   * Loads a JSON file.
   *
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addJson(id, url) {
    if (!id || !url) {
      throw new TypeError(`You must provide an ID and an URL.`)
    }

    this.game.log.trace(`(resources) Loading json "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'json'}})
  }

}


module.exports = ResourcesManager