import spriteSheetMetadataSchema from 'core/config/spriteSheetMetadataSchema'
import SpriteSheet from 'core/SpriteSheet'
import * as utils from 'utils'

export default function spriteSheetMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'spritesheet') {
      return next()
    }

    // Validate loading status
    if (!resource.data) {
      resource.error = `Invalid spritesheet metadata file.`
      return next()
    }

    // Validate metadata
    let data = null
    try {
      data = utils.validateJson(resource.metadata.data, {}, spriteSheetMetadataSchema)
    } catch (e) {
      console.log(e)
      resource.error = `Invalid spritesheet metdata.`
      return next()
    }

    // Format options to load the spritesheet texture
    let Resource = PIXI.loaders.Resource
    let textureId = resource.name+'_texture'
    let options = {
      crossOrigin    : resource.crossOrigin,
      loadType       : Resource.LOAD_TYPE.IMAGE,
      metadata       : data,
      parentResource : resource,
    }

    //Load the texture
    game.resources._loader.add(textureId, data.image, options, (res) => {
      console.log(res)
    })


    // let audios = []
    // for (let i=0; i<resource.metadata.data.length; i++) {
    //   let data = resource.metadata.data[i]

    //   let audio = game.sounds.createAudio(
    //     data.id,
    //     resource.data,
    //     data,
    //     resource.url
    //   )
      
    //   game.resources.cacheResource(
    //     data.id,
    //     resource.url,
    //     audio,
    //     resource.metadata
    //   )

    //   audios.push(audio)
    // }

    // resource.audios = audios
    next()
  }
} 
