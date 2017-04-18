import spriteSheetMetadataSchema from 'sk/config/spriteSheetMetadataSchema'
import spriteSheetMetadataDefaults from 'sk/config/spriteSheetMetadataDefaults'
import SpriteSheet from 'sk/core/SpriteSheet'
import * as utils from 'sk/utils'

/**
 * Middleware for loading sprite sheets.
 *
 * This middleware can handle two different forms of loading sprite sheets: you
 * may provide a JSON file with the spritesheet metadata, or provide the 
 * texture file and the spritesheet metadata. If you provide a JSON, the 
 * middleware will load the proper images automatically.
 */
export default function spriteSheetMiddleware(game) {
  return function(resource, next) {
    // Check for the texture metadata type. This is set by skald or the user in
    // the manifest file
    if (resource.metadata.type !== 'spriteSheet') {
      return next()
    }

    // Check for the flags filled by the loader
    if (!resource.data) {
      resource.error = `Invalid files for the sprite sheet loading with id `+
                       `"${id}".`
      return next()
    }

    // Validate if sprite sheet is defined
    if (resource.xhrType !== 'json' && !resource.metadata.data) {
      resource.error = `Spritesheet metadata not defined for id "${id}".`
      return next()
    }

    // Get the metadata and the texture loaded data (if it is the case)
    let metadata = resource.data
    let textureRawData = null
    if (resource.xhrType !== 'json') {
      metadata = resource.metadata.data
      textureRawData = resource.data
    }

    // Validate the metadata
    let data = {}
    try {
      data = utils.validateJson(
        metadata,
        spriteSheetMetadataDefaults,
        spriteSheetMetadataSchema
      )
    } catch (e) {
      console.log(e)
      resource.error = `Invalid spritesheet metadata (id "${id}"). `+
                       `Check the console for more information.`
      return next()
    }

    resource.spriteSheetMetadata = data

    // If texture has already been loaded
    if (!textureRawData) {

      // Format options to load the spritesheet texture
      let urlItems = resource.url.replace(/\/*$/g, '').split('/')
      let baseUrl = resource.url.replace(urlItems.pop(), '')
      let textureUrl = baseUrl+metadata.image

      let Resource = PIXI.loaders.Resource
      let textureId = resource.name+'_texture'
      let options = {
        crossOrigin    : resource.crossOrigin,
        loadType       : Resource.LOAD_TYPE.IMAGE,
        metadata       : {},
        parentResource : resource,
      }

      //Load the texture
      game.resources._loader.add(textureId, textureUrl, options, (res) => {
        resource.spriteSheet = parse(
          resource.name,
          {url:resource.url, data:data},
          {url:textureUrl, texture:res.data}
        )
        return next()
      })

    // If texture has not been loaded
    } else {
      let textureId = resource.name+'_texture'
      resource.spriteSheet = parse(
        resource.name,
        {url:null, data:data},
        {url:resource.url, texture:textureRawData}
      )
      return next()
    }
  }

  function parse(id, dataInfo, textureInfo) {
    let resolution = PIXI.utils.getResolutionOfUrl(textureInfo.url)
    let baseTexture = new PIXI.BaseTexture(textureInfo.texture, null, resolution)
    baseTexture.imageUrl = textureInfo.url

    if (dataInfo.data.resolution !== 1) {
      baseTexture.resolution = dataInfo.data.resolution
      baseTexture.update()
    }

    // Process textures
    let textures = {}
    let isRegular = !Array.isArray(dataInfo.data.frames)
    if (isRegular) {
      textures = processRegular(dataInfo.data, baseTexture)
    } else {
      textures = processIrregular(dataInfo.data, baseTexture)
    }

    // Save textures on caches
    let keys = Object.keys(textures)
    for (let i=0; i<keys.length; i++) {
      let key = keys[i]
      let texture = textures[key]

      // Cache by name on pixi
      PIXI.BaseTextureCache[id+'_texture'] = baseTexture
      PIXI.TextureCache[id+'_texture'] = texture

      // Cache on resource
      game.resources.cacheResource(
        isRegular? `${id}_texture_${key}` : key,
        null,
        texture
      )
    }

    // Save spritesheet object
    let spriteSheet = new SpriteSheet(
      textures,
      dataInfo.data.animations,
      dataInfo.data.frameRate
    )
    game.resources.cacheResource(id, null, spriteSheet)

    // Save base texture and metadata
    let texture = new PIXI.Texture(baseTexture)
    game.resources.cacheResource(
      id+'_metadata',
      dataInfo.url,
      dataInfo.data,
      null
    )

    game.resources.cacheResource(
      id+'_texture',
      textureInfo.url,
      texture,
      null
    )

    return spriteSheet
  }

  function processIrregular(metadata, baseTexture) {
    let resolution = metadata.resolution
    let textures = {}

    for (let i=0; i<metadata.frames.length; i++) {
      let frame = metadata.frames[i]
      let rect = null

      if (frame.rotated) {
        rect = new PIXI.Rectangle(
          frame.rect.x/resolution,
          frame.rect.y/resolution,
          frame.rect.height/resolution,
          frame.rect.width/resolution
        )
      } else {
        rect = new PIXI.Rectangle(
          frame.rect.x/resolution,
          frame.rect.y/resolution,
          frame.rect.width/resolution,
          frame.rect.height/resolution
        )
      }

      let orig = new PIXI.Rectangle(0, 0, rect.width, rect.height)

      let texture = new PIXI.Texture(
        baseTexture,
        rect,
        orig,
        null,
        frame.rotated? 2:0
      )
      textures[frame.id] = texture
    }

    return textures
  }

  function processRegular(metadata, baseTexture) {
    let resolution = metadata.resolution
    let frames = metadata.frames

    let x = frames.margin
    let y = frames.margin
    let count = 0

    let textures = {}
    while (y < baseTexture.height && !(frames.count && count >= frames.count)) {
      
      x = frames.margin
      while (x < baseTexture.width) {
        count += 1
        if (frames.count && count >= frames.count) {
          break
        }

        let rect = new PIXI.Rectangle(
          x/resolution,
          y/resolution,
          frames.width/resolution,
          frames.height/resolution
        )
        let orig = new PIXI.Rectangle(0, 0, rect.width, rect.height)
        let texture = new PIXI.Texture(baseTexture, rect, orig)
        textures[`${count-1}`] = texture

        x += frames.width+frames.spacing
      }

      y += frames.height+frames.spacing
    }

    return textures
  }
} 