import Manager from 'sk/core/Manager'

import ResourceEvent from 'sk/events/ResourceEvent'
import ProgressEvent from 'sk/events/ProgressEvent'
import ErrorEvent from 'sk/events/ErrorEvent'

import audioMetadataSchema from 'sk/config/audioMetadataSchema'
import audioSpriteMetadataSchema from 'sk/config/audioSpriteMetadataSchema'

import * as middlewares from 'sk/middlewares'
import * as utils from 'sk/utils'


const CODECS = {
  'ogg'   : 'ogg',
  'ogv'   : 'ogg',
  'oga'   : 'ogg',
  'ogx'   : 'ogg',
  'ogm'   : 'ogg',
  'spx'   : 'ogg',
  'opus'  : 'opus',
  'm4a'   : 'm4a',
  'mp4'   : 'm4a',
  'm4p'   : 'm4a',
  'm4b'   : 'm4a',
  'm4r'   : 'm4a',
  'm4v'   : 'm4a',
  'mp3'   : 'mp3',
  'wav'   : 'wav',
  'wave'  : 'wav',
  'webm'  : 'webm',
  'ac3'   : 'dolby',
}

/**
 * Resources manager handle the loading and caching of the game assets.
 */
export default class ResourcesManager extends Manager {

  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._loader = null
    this._resources = {}
    
    this._stackSize = 0
  }

  /**
   * Bash path that will be used for all resources during loading.
   * @type {String}
   */
  get basePath() { return this._loader.baseUrl }

  /**
   * Maximum number of concurrent loading process.
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

    // We have to force PIXI loader to load audio data as an arraybuffer, in 
    // XHR, so we need to register manually the audio extensions. See
    // https://github.com/englercj/resource-loader/issues/31 for more info. 
    let Resource = PIXI.loaders.Resource
    let audioExtensions = ['ogg', 'opus', 'mp3', 'wav', 'm4a', 'webm', 'ac3']
    for (let i=0; i<audioExtensions.length; i++) {
      let ext = audioExtensions[i]
      Resource.setExtensionLoadType(ext, Resource.LOAD_TYPE.XHR);
      Resource.setExtensionXhrType(ext, Resource.XHR_RESPONSE_TYPE.BUFFER);
    }
  }

  /**
   * Setup the loader middlewares.
   */
  _setupMiddlewares() {
    // remove the current middlewares from the pixi loader. We don't change 
    // the Load._pixiMiddleware variable to avoid any conflit with non-skald 
    // pixi game running in the same page.
    this._loader._afterMiddleware = []

    this._loader.use(middlewares.textureMiddleware(this.game))
    this._loader.use(middlewares.jsonMiddleware(this.game))
    this._loader.use(middlewares.rawMiddleware(this.game))
    this._loader.use(middlewares.audioMiddleware(this.game))
    this._loader.use(middlewares.audioSpriteMiddleware(this.game))
    this._loader.use(middlewares.spriteSheetMiddleware(this.game))
    this._loader.use(middlewares.bitmapFontMiddleware(this.game))
  }

  /**
   * Configure the PIXI loader events.
   */
  _setupEvents() {
    this._loader.on('progress', (l, r)=>this._onProgress(l, r))
    this._loader.on('error', (e, l, r)=>this._onError(e, l, r))
    this._loader.on('load', (l, r)=>this._onLoad(l, r))
    this._loader.on('complete', ()=>this._onComplete())
  }

  /**
   * Handle progress event.
   */
  _onProgress(loader, resource) {
    let total = this._stackSize
    let loaded = parseInt(this._stackSize*loader.progress/100)
    
    let event = this.game.pool.create(ProgressEvent)
    event._type = 'resources.progress'
    event._loaded = loaded
    event._total = total
    this.game.events.dispatch(event)
  }
  
  /**
   * Handle error event.
   */
  _onError(error, loader, resource) {
    let event = this.game.pool.create(ErrorEvent)
    event._type = 'resources.error'
    event._message = `Could not load the resource "${resource.name}" from `+
                     `"${resource.url}".`
    this.game.events.dispatch(event)

    this.game.log.warn(
      `Could not load the resource "${resource.name}" from "${resource.url}".`
    )
  }
  
  /**
   * Handle load event.
   */
  _onLoad(loader, resource) {
    let r = this._resources[resource.name] || {}
    
    let event = this.game.pool.create(ResourceEvent)
    event._type = 'resources.load'
    event._id = resource.name
    event._url = resource.url
    event._resource = r.resource
    event._metadata = r.metadata
    this.game.events.dispatch(event)
  }
  
  /**
   * Handle complete event.
   */
  _onComplete(event) {
    this.game.events.dispatch('resources.complete')
    this._stackSize = 0
    this._loader.reset()
  }

  /**
   * Automatically extract the audio URL, considering the browser support. 
   * Check the CODEC constant (in this file) to see the priority order.
   */
  _getAudioUrl(url) {
    if (Array.isArray(url)) {
      let extensions = Object.keys(CODECS)
      let device = this.game.device

      for (let i=0; i<url.length; i++) {
        let file = url[i].toLowerCase()

        let extension = extensions.find(e => file.endsWith(e))
        if (extension && device[CODECS[extension]]) {
          url  = url[i]
          break
        }
      }
    }

    return url
  }

  /**
   * Register and store a resource for future usage.
   *
   * @param {String} id - The resource identifier.
   * @param {String} url - The resource URL, you may provide a `null` value.
   * @param {Object} resources - The resource object.
   * @param {Object} [metadata] - The raw metadata provided by the user.
   */
  cacheResource(id, url, resource, metadata) {
    this._resources[id] = {url, resource, metadata}
  }

  /**
   * Load a complete manifest with the target resources.
   *
   * @param {Array<Object>} manifest - A JSON object with the manifest.
   */
  addManifest(manifest) {
    this.game.log.trace(`(resources) Loading manifest.`)

    // Only accepts arrays
    if (!Array.isArray(manifest)) {
      throw new Error(`Manifest must be an array.`)
    }

    // Shortcuts for the specific loaders
    let loaders = {
      texture     : (id, url, data) => this.addTexture(id, url, data),
      audio       : (id, url, data) => this.addAudio(id, url, data.data),
      json        : (id, url, data) => this.addJson(id, url, data),
      spriteSheet : (id, url, data) => this.addSpriteSheet(id, url, data.data),
      audioSprite : (id, url, data) => this.addAudioSprite(url, data.data),
      bitmapFont  : (id, url, data) => this.addBitmapFont(id, url, data),
      raw         : (id, url, data) => this.addRaw(id, url, data),
    }

    // Loop through each resource manifest
    for (let i=0; i<manifest.length; i++) {
      let data = manifest[i]

      if (!data.url) throw new Error(`Manifest item "${i}" with no URL.`)
      if (!data.type) throw new Error(`Manifest item "${i}" with no type.`)

      if (data.type !== 'audioSprite' && !data.id) {
        throw new Error(`Manifest item "${i}" with no ID.`)
      }

      let loader = loaders[data.type]
      if (!loader) throw new Error(`Manifest item "${i}" with invalid type "${data.type}".`)

      loader(data.id, data.url, data)
    }
  }

  /**
   * Loads a texture. The resource is loaded into a sk.Texture object, which is
   * an alias for the PIXI.Texture object, and can be accessed with:
   *
   *     game.resources.get('RESOURCEID') // returns the texture
   *
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addTexture(id, url) {
    this.game.log.trace(`(resources) Loading texture "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata:{type: 'texture'}})
  }

  /**
   * Loads a JSON file into a JavaScript object.
   *
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addJson(id, url) {
    this.game.log.trace(`(resources) Loading json "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'json'}})
  }

  /**
   * Loads a generic file without any processing or convertion.
   *
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addRaw(id, url) {
    this.game.log.trace(`(resources) Loading raw "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'raw'}})
  }

  /**
   * The xml
   * 
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addBitmapFont(id, url) {
    this.game.log.trace(`(resources) Loading bitmap font "${id}" from "${url}".`)

    this._loader.add(id, url, {metadata:{type: 'bitmapFont'}})
  }

  /**
   * Send a url string or array of urls.
   * 
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addAudio(id, url, data) {
    url = this._getAudioUrl(url)

    this.game.log.trace(`(resources) Loading audio "${id}" from "${url}".`)
    data = utils.validateJson(data||{}, {}, audioMetadataSchema)

    this._loader.add(id, url, {metadata: {type: 'audio', data: data}})
  }

  /**
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addSpriteSheet(id, url, data) {
    this.game.log.trace(`(resources) Loading sprite sheet "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'spriteSheet', data: data}})
  }

  /**
   * @param {String} id - The resource ID.
   * @param {String} url - The resource url.
   */
  addAudioSprite(url, data) {
    url = this._getAudioUrl(url)

    this.game.log.trace(`(resources) Loading audio sprite from "${url}".`)
    data = utils.validateJson(data||{}, {}, audioSpriteMetadataSchema)

    let randomId = ('$audiosprite-' + Math.random()).substring(15)
    this._loader.add(randomId, url, {metadata: {type: 'audioSprite', data: data}})
  }

  /**
   * Start the loading.
   *
   * @param {Function} [callback] - Optional callback to be called after the
   *        current stack has finished.
   */
  load(callback) {
    this._stackSize = this._loader._queue._tasks.length
    this._loader.load(callback)
  }


  /**
   * Returns a list of all resources by ID.
   *
   * @return {Array<String>} The array with resource IDs.
   */
  list() {
    return Object.keys(this._resources)
  }

  /**
   * Returns a resource object by its ID.
   *
   * @param {String} id - The resource ID.
   * @return {Object} The resource object.
   */
  get(id) {
    let r = this._resources[id]
    if (r) {
      return r.resource
    }
  }

  /**
   * Returns the URL for a given resource ID.
   *
   * @param {String} id - The resource ID.
   * @return {String} The resource URL.
   */
  getUrl(id) {
    let r = this._resources[id]
    if (r) {
      return r.url
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
    let r = this._resources[id]
    if (r) {
      return r.metadata
    }
  }

  /**
   * Returns a boolean telling if manager is loading a resource or not.
   *
   * @return {Boolean} Flag.
   */
  isLoading() {
    return this._loader.loading
  }

}
