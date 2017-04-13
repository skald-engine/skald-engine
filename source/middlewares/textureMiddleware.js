// Note: before implementing your own custom middleware, I really recommend 
// that you check the original loader code at:
// 
// https://github.com/englercj/resource-loader/
//
// Our middlewares follow a basic logic structure:
// 
// - Check for the file types and other precondition
// - Convert the resource into a proper engine object
// - Cache the resource object into the resources manager or pixi cache objects
//
// You may use this middleware as an example of simple implementation. If you
// want to implement a bit more complex middleware, take a look into the 
// spritesheet middleware.

/**
 * This middleware is a replacement for the PIXI texture parse. 
 */
export default function textureMiddleware(game) {
  return function(resource, next) {
    
    // Check for the texture metadata type. This is set by skald or the user in
    // the manifest file
    if (resource.metadata.type !== 'texture') {
      return next()
    }

    // Check for the flags filled by the loader
    if (!resource.isImage || !resource.data) {
      resource.error = `Invalid texture file.`
      return next()
    }

    // Create the base texture and the texture object
    let resolution = PIXI.utils.getResolutionOfUrl(resource.url)
    let baseTexture = new PIXI.BaseTexture(resource.data, null, resolution)
    let texture = new PIXI.Texture(baseTexture)
    baseTexture.imageUrl = resource.url

    // Add the texture to the PIXI cache
    resource.texture = texture

    //     by the name
    PIXI.BaseTextureCache[resource.name] = baseTexture
    PIXI.TextureCache[resource.name] = resource.texture

    //     by the url
    if (resource.url && resource.name !== resource.url) {
      PIXI.BaseTextureCache[resource.url] = baseTexture
      PIXI.TextureCache[resource.url] = resource.texture
    }

    // Add the texture to game resources
    game.resources.cacheResource(
      resource.name,
      resource.url,
      resource.texture,
      resource.metadata
    )

    // Done
    next()
  }
} 