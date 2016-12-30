import Manager from 'core/Manager'
import ResourceEvent from 'core/events/ResourceEvent'
import ProgressEvent from 'core/events/ProgressEvent'
import ErrorEvent from 'core/events/ErrorEvent'
import textureMiddleware from 'core/managers/resources/textureMiddleware'

export default class ResourcesManager extends Manager {
  constructor(game) {
    super(game)

    this._loader = null
    this._resources = {}
  }

  get basePath() { return this._loader.baseUrl }
  get maxConcurrency() { return this._loader._queue.concurrency }

  setup() {
    this._setupLoader()
    this._setupMiddlewares()
    this._setupEvents()
  }

  _setupLoader() {
    let config = this.game.config
    let basePath = config.resources.basePath
    let maxConcurrency = config.resources.maxConcurrency

    this._loader = new PIXI.loaders.Loader(basePath, maxConcurrency)
  }

  _setupMiddlewares() {
    // remove the current middlewares from the pixi loader. We don't change 
    // the Load._pixiMiddleware variable to avoid any conflit with non-skald 
    // pixi game running in the same page.
    this._loader._afterMiddleware = []
    this._loader.use(textureMiddleware(this.game))
  }

  _setupEvents() {
    this._loader.on('progress', (l, r)=>this._onProgress(l, r))
    this._loader.on('error', (e, l, r)=>this._onError(e, l, r))
    this._loader.on('load', (l, r)=>this._onLoad(l, r))
    this._loader.on('complete', ()=>this._onComplete())
  }

  _onProgress(loader, resource) {
    let total, loaded

    let inverseProgress = 1-loader.progress/100

    // we try to overcome a limitation of PIXI loader, which does not track
    // how many files have been loaded.
    if (inverseProgress < 0.0001) {
      total = loaded = 1
    } else {
      total = Math.round((loader._numToLoad)/(inverseProgress))
      loaded = total-loader._numToLoad
    }
    
    this.game.events.dispatch(
      new ProgressEvent(
        'resourceprogress', 
        loaded,
        total
      )
    )
  }
  
  _onError(error, loader, resource) {
    this.game.events.dispatch(
      new ErrorEvent(
        'resourceerror',
        `Could not load the resource "${resource.name}" from "${resource.url}".`
      )
    )
  }
  
  _onLoad(loader, resource) {
    let r = this._resources[resource.name]
    this.game.events.dispatch(
      new ResourceEvent(
        'resourceload',
        resource.name,
        resource.url,
        r.resource,
        r.metadata,
      )
    )
  }
  
  _onComplete(event) {
    this.game.events.dispatch('resourcecomplete')
  }

  cacheResource(id, resource, metadata) {
    this._resources[id] = {resource, metadata}
  }

  loadManifest(manifest) {}

  loadTexture(id, url) {
    this.game.log.trace(`(resources) Loading texture "${id}" from "${url}".`)

    this._loader.add(id, url, {metadata:{type: 'texture'}})
    this._loader.load()
  }

  loadAudio(id, url) {}
  loadJson(id, url) {}
  loadScript(id, url) {}
  loadStyle(id, url) {}
  loadSpriteSheet(id, url, data) {}
  loadAudioSprite(id, url, data) {}
  loadRaw(id, url) {}

  get(id) {
    let r = this._resources[id]
    if (r) { return r.resource }
  }
  getMetadata(id) {
    let r = this._resources[id]
    if (r) { return r.metadata }
  }

  isLoading() {}
  hasFinished() {}

}