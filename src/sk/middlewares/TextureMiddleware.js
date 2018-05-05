const pixi = require('pixi.js')
const Middleware = require('sk/core/Middleware')

class TextureMiddleware extends Middleware {
  validate(resource) {
    return resource.pixiResource.type === pixi.loaders.Resource.TYPE.IMAGE
  }

  process(resource) {
    let resolution = pixi.utils.getResolutionOfUrl(resource.url)
    let baseTexture = new pixi.BaseTexture(resource.rawData, null, resolution)
    let texture = new pixi.Texture(baseTexture)
    baseTexture.imageUrl = resource.url

    return texture
  }

  cache(resource) {
    pixi.BaseTexture.addToCache(resource.data.baseTexture, resource.id)
    pixi.BaseTexture.addToCache(resource.data.baseTexture, resource.url)
    pixi.Texture.addToCache(resource.data, resource.id)
    pixi.Texture.addToCache(resource.data, resource.url)
  }

  unload(resource) {
    pixi.Texture.removeFromCache(resource.data)
    pixi.BaseTexture.removeFromCache(resource.data.baseTexture)
  }
}

module.exports = TextureMiddleware