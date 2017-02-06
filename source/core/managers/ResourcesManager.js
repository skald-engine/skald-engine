import Manager from 'core/Manager'

import ResourceEvent from 'core/events/ResourceEvent'
import ProgressEvent from 'core/events/ProgressEvent'
import ErrorEvent from 'core/events/ErrorEvent'

import textureMiddleware from 'core/managers/resources/textureMiddleware'
import audioMiddleware from 'core/managers/resources/audioMiddleware'
import jsonMiddleware from 'core/managers/resources/jsonMiddleware'
import rawMiddleware from 'core/managers/resources/rawMiddleware'
import audioSpriteMiddleware from 'core/managers/resources/audioSpriteMiddleware'
import bitmapFontMiddleware from 'core/managers/resources/bitmapFontMiddleware'
import spriteSheetMiddleware from 'core/managers/resources/spriteSheetMiddleware'

import * as utils from 'utils'
import audioMetadataSchema from 'core/config/audioMetadataSchema'
import audioSpriteMetadataSchema from 'core/config/audioSpriteMetadataSchema'

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


export default class ResourcesManager extends Manager {
  constructor(game) {
    super(game)

    this._loader = null
    this._resources = {}
  }

  get basePath() { return this._loader.baseUrl }
  get maxConcurrency() { return this._loader._queue.concurrency }

  setup() {
    utils.profiling.begin('resources')
    this._setupLoader()
    this._setupMiddlewares()
    this._setupEvents()
    utils.profiling.end('resources')
  }

  _setupLoader() {
    let config = this.game.config
    let basePath = config.resources.basePath
    let maxConcurrency = config.resources.maxConcurrency

    this._loader = new PIXI.loaders.Loader(basePath, maxConcurrency)

    let Resource = PIXI.loaders.Resource

    // https://github.com/englercj/resource-loader/issues/31
    let audioExtensions = ['ogg', 'opus', 'mp3', 'wav', 'm4a', 'webm', 'ac3']
    for (let i=0; i<audioExtensions.length; i++) {
      let ext = audioExtensions[i]
      Resource.setExtensionLoadType(ext, Resource.LOAD_TYPE.XHR);
      Resource.setExtensionXhrType(ext, Resource.XHR_RESPONSE_TYPE.BUFFER);
    }
  }

  _setupMiddlewares() {
    // remove the current middlewares from the pixi loader. We don't change 
    // the Load._pixiMiddleware variable to avoid any conflit with non-skald 
    // pixi game running in the same page.
    this._loader._afterMiddleware = []
    this._loader.use(textureMiddleware(this.game))
    this._loader.use(audioMiddleware(this.game))
    this._loader.use(jsonMiddleware(this.game))
    this._loader.use(rawMiddleware(this.game))
    this._loader.use(audioSpriteMiddleware(this.game))
    this._loader.use(bitmapFontMiddleware(this.game))
    this._loader.use(spriteSheetMiddleware(this.game))
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
    let r = this._resources[resource.name] || {}
    this.game.events.dispatch(
      new ResourceEvent(
        'resourceload',
        resource.name,
        resource.url,
        r.resource,
        r.metadata
      )
    )
  }
  
  _onComplete(event) {
    this.game.events.dispatch('resourcecomplete')
  }

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

  cacheResource(id, url, resource, metadata) {
    this._resources[id] = {url, resource, metadata}
  }

  loadManifest(manifest) {
    this.game.log.trace(`(resources) Loading manifest.`)

    let loaders = {
      texture     : (id, url, data) => this.loadTexture(id, url, data),
      audio       : (id, url, data) => this.loadAudio(id, url, data),
      json        : (id, url, data) => this.loadJson(id, url, data),
      spriteSheet : (id, url, data) => this.loadSpriteSheet(id, url, data.data),
      audioSprite : (id, url, data) => this.loadAudioSprite(url, data.sounds),
      bitmapFont  : (id, url, data) => this.loadBitmapFont(id, url, data),
      raw         : (id, url, data) => this.loadRaw(id, url, data),
    }

    if (!Array.isArray(manifest)) {
      throw new Error(`Manifest must be an array.`)
    }

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

  loadTexture(id, url) {
    this.game.log.trace(`(resources) Loading texture "${id}" from "${url}".`)

    this._loader.add(id, url, {metadata:{type: 'texture'}})
    this._loader.load()
  }

  loadBitmapFont(id, url) {
    this.game.log.trace(`(resources) Loading bitmap font "${id}" from "${url}".`)

    this._loader.add(id, url, {metadata:{type: 'bitmapFont'}})
    this._loader.load()
  }

  loadAudio(id, url, data) {
    url = this._getAudioUrl(url)

    this.game.log.trace(`(resources) Loading audio "${id}" from "${url}".`)
    data = utils.validateJson(data||{}, {}, audioMetadataSchema)

    this._loader.add(id, url, {metadata: {type: 'audio', data: data}})
    this._loader.load()
  }

  loadJson(id, url) {
    this.game.log.trace(`(resources) Loading json "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'json'}})
    this._loader.load()
  }

  loadSpriteSheet(id, url, data) {
    this.game.log.trace(`(resources) Loading sprite sheet "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'spriteSheet', data: data}})
    this._loader.load()
  }

  loadAudioSprite(url, data) {
    url = this._getAudioUrl(url)

    this.game.log.trace(`(resources) Loading audio sprite from "${url}".`)
    data = utils.validateJson(data||{}, {}, audioSpriteMetadataSchema)

    let randomId = ('$audiosprite-' + Math.random()).substring(15)
    this._loader.add(randomId, url, {metadata: {type: 'audioSprite', data: data}})
    this._loader.load()
  }

  loadRaw(id, url) {
    this.game.log.trace(`(resources) Loading raw "${id}" from "${url}".`)
    this._loader.add(id, url, {metadata: {type: 'raw'}})
    this._loader.load()
  }

  list() {
    return Object.keys(this._resources)
  }

  get(id) {
    let r = this._resources[id]
    if (r) { return r.resource }
  }

  getUrl(id) {
    let r = this._resources[id]
    if (r) { return r.url }
  }

  getMetadata(id) {
    let r = this._resources[id]
    if (r) { return r.metadata }
  }

  isLoading() {
    return this._loader.loading
  }

}