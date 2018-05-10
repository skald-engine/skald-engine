
// https://github.com/pixijs/pixi-sound/blob/master/src/utils/SoundUtils.ts
const pixi = require('pixi.js')

const $ = require('sk/$')
const C = require('sk/constants')
const Middleware = require('sk/core/Middleware')
const AudioMiddleware = require('sk/middlewares/AudioMiddleware')
const Resource = require('sk/core/Resource')

function validateItem(x) {
  return x => x &&
         !!x.id &&
         typeof x.offset !== 'undefined' &&
         typeof x.duration !== 'undefined'
}

class AudioSpriteMiddleware extends Middleware {
  check(url, metadata) {
    if (!Array.isArray(metadata)) {
      throw new Error(`AudioSprite metadata is obligatory and must be an array.`)
    }

    if (!metadata.every(validateItem)) {
      throw new Error(`AudioSprite metadata items must have an "id", an "offset and a "duration" attribute`)
    }

    return true
  }

  setup() {
    super.setup()

    let injector = $.getInjector()
    this._sounds = injector.resolve('sounds')
  }

  preProcess(url, metadata) {
    url = AudioMiddleware.resolveUrl(url)
    return {url, metadata}
  }

  validate(resource) {
    return resource.pixiResource.loadType === pixi.loaders.Resource.LOAD_TYPE.XHR &&
           resource.pixiResource.xhrType === pixi.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER
  }

  process(resource) {
    let pixiResource = resource.pixiResource
    let baseAudios = this._sounds.createRawBash(resource.rawData, resource.metadata)
    let baseAudio = this._sounds.createRaw(resource.rawData, {})
    this._sounds.context.decodeAudioData(resource.rawData, buffer => {
      baseAudio.buffer = buffer
      baseAudios.forEach(x => x.buffer = buffer)
    })

    for (let i=0; i<baseAudios.length; i++) {
      let audio = baseAudios[i]
      let metadata = resource.metadata[i]

      let audioResource = new Resource(
        C.RESOURCES.AUDIO_SPRITE,
        metadata.id,
        null,
        pixiResource.xhrType,
        pixiResource.data,
        {},
        pixiResource
      )
      audioResource.data = audio
      resource.addChild(audioResource)
    }

    return baseAudio
  }
}

module.exports = AudioSpriteMiddleware