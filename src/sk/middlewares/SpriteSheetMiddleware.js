const pixi = require('pixi.js')
const C = require('sk/constants')
const $ = require('sk/$')
const Middleware = require('sk/core/Middleware')
const Resource = require('sk/core/Resource')
const SpriteSheet = require('sk/core/SpriteSheet')

class SpriteSheetMiddleware extends Middleware {
  setup() {
    super.setup()
    this._config = $.getInjector().resolve('config')
    this._resources = $.getInjector().resolve('resources')
    this._device = $.getInjector().resolve('device')
  }
  
  validate(resource) {
    return !!resource.rawData.meta &&
           !!resource.rawData.frames &&
           !!resource.rawData.meta.image
  }

  process(resource) {
    let textureUrl = this._getTextureUrl(resource)

    let texture = this._resources.getByUrl(textureUrl)
    if (texture) {
      let data = this._parse(resource, texture, textureUrl)
      return data

    } else {
      return new Promise(async (resolve, reject) => {
        let texturePixiResource = await this._loadTexture(resource, textureUrl)
        let textureResource = this._createTexture(texturePixiResource)

        resource.addChild(textureResource)
        let data = this._parse(resource, textureResource)

        resolve(data)
      })
    }

    return resource.rawData
  }

  cache(resource) {
    let textureResource = resource.children[0]
    let framesResources = textureResource.children

    pixi.BaseTexture.addToCache(textureResource.data.baseTexture, textureResource.id)
    pixi.BaseTexture.addToCache(textureResource.data.baseTexture, textureResource.url)
    pixi.Texture.addToCache(textureResource.data, textureResource.id)
    pixi.Texture.addToCache(textureResource.data, textureResource.url)

    framesResources.forEach(frame => {
      pixi.Texture.addToCache(frame.data, frame.id)
    })
  }

  unload(resource) {
    // pixi.Texture.removeFromCache(resource.data)
    // pixi.BaseTexture.removeFromCache(resource.data.baseTexture)
    // 
    let textureResource = resource.children[0]
    let framesResources = textureResource.children

    pixi.Texture.removeFromCache(textureResource.data)
    pixi.BaseTexture.removeFromCache(textureResource.data.baseTexture)

    framesResources.forEach(frame => {
      pixi.Texture.removeFromCache(frame.data)
    })
  }

  _getTextureUrl(resource) {
    let urlItems = resource.url.replace(/\/*$/g, '').split('/')
    let baseUrl = resource.url.replace(urlItems.pop(), '')
    let pruneLength = this._config.get('resources.base_path', '').length
    baseUrl = baseUrl.substring(pruneLength)
    return baseUrl + resource.rawData.meta.image
  }

  _loadTexture(resource, textureUrl) {
    let textureId = `${resource.id}_texture`
    let options = {
      crossOrigin    : resource.pixiResource.crossOrigin,
      loadType       : pixi.loaders.Resource.LOAD_TYPE.IMAGE,
      metadata       : resource.pixiResource.metadata.data,
      parentResource : resource.pixiResource,
    }

    return new Promise((resolve, reject) => {
      this._resources._loader.add(textureId, textureUrl, options, resolve)
    })
  }

  _createTexture(pixiResource) {
    let textureResource = new Resource(
      C.RESOURCES.SPRITE_SHEET,
      pixiResource.name,
      pixiResource.url,
      pixiResource.xhrType,
      pixiResource.data,
      {},
      pixiResource
    )

    let resolution = pixi.utils.getResolutionOfUrl(textureResource.url)
    let baseTexture = new pixi.BaseTexture(textureResource.rawData, null, resolution)
    let texture = new pixi.Texture(baseTexture)
    baseTexture.imageUrl = textureResource.url
    textureResource.data = texture

    return textureResource
  }

  _parse(jsonResource, textureResource) {
    let meta = jsonResource.rawData.meta
    let frames = jsonResource.rawData.frames
    let baseTexture = textureResource.data.baseTexture
    let resolution = baseTexture.resolution

    let textures = {}

    Object.keys(frames).forEach(id => {
      let frameData = frames[id]

      let x = frameData.frame.x/resolution
      let y = frameData.frame.y/resolution
      let w = frameData.frame.w/resolution
      let h = frameData.frame.h/resolution

      let rect = null
      if (frameData.rotated) {
        rect = new pixi.Rectangle(x, y, h, w)
      } else {
        rect = new pixi.Rectangle(x, y, w, h)
      }

      let orig = new pixi.Rectangle(0, 0, rect.width, rect.height)
      let texture = new pixi.Texture(baseTexture, rect, orig, null, frameData.rotated? 2 : 0)

      textures[id] = texture
      let resource = new Resource(
        C.RESOURCES.SPRITE_SHEET,
        `${textureResource.id}_${id}` ,
        textureResource.url,
        textureResource.xhrType,
        textureResource.data,
        {},
        textureResource.pixiResource
      )
      resource.data = texture

      textureResource.addChild(resource)
    })
    jsonResource.addChild(textureResource)

    return new SpriteSheet(
      textures,
      meta.animations, 
      jsonResource.rawData,
      meta.frame_rate
    )
  }
}

module.exports = SpriteSheetMiddleware