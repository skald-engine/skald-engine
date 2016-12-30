/**
 * This middleware is a raplacement for the PIXI texture parse. 
 */
export default function textureMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'texture') {
      return next()
    }

    if (!resource.isImage || !resource.data) {
      resource.error = `Invalid texture file.`
      return next()
    }

    let url = PIXI.utils.getResolutionOfUrl(resource.url)
    let baseTexture = new PIXI.BaseTexture(resource.data, null, url)

    // Add the texture to the PIXI cache
    baseTexture.imageUrl = resource.url
    resource.texture = new PIXI.Texture(baseTexture)

    PIXI.BaseTextureCache[resource.name] = baseTexture
    PIXI.TextureCache[resource.name] = resource.texture

    if (resource.name !== resource.url){
      PIXI.BaseTextureCache[resource.url] = baseTexture
      PIXI.TextureCache[resource.url] = resource.texture
    }

    // Add the texture to game resources
    game.resources.cacheResource(
      resource.name,
      resource.texture,
      resource.metadata
    )

    next()
  }
} 