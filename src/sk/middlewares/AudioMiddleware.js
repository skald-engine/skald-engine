
// https://github.com/pixijs/pixi-sound/blob/master/src/utils/SoundUtils.ts
const pixi = require('pixi.js')

const $ = require('sk/$')
const Middleware = require('sk/core/Middleware')

const RE_URL = /\.(\{([^\}]+)\})(\?.*)?$/
const CODECS = {
  'ogg'  : 'ogg',
  'ogv'  : 'ogg',
  'oga'  : 'ogg',
  'ogx'  : 'ogg',
  'ogm'  : 'ogg',
  'spx'  : 'ogg',
  'opus' : 'opus',
  'm4a'  : 'm4a',
  'mp4'  : 'm4a',
  'm4p'  : 'm4a',
  'm4b'  : 'm4a',
  'm4r'  : 'm4a',
  'm4v'  : 'm4a',
  'mp3'  : 'mp3',
  'wav'  : 'wav',
  'wave' : 'wav',
  'webm' : 'webm',
  'ac3'  : 'dolby'
}

class AudioMiddleware extends Middleware {
  static resolveUrl(url) {
    if (RE_URL.test(url)) {
      let device = $.getInjector().resolve('device')

      let groups = RE_URL.exec(url)
      let extensions = groups[2].split(',')

      let extension = null
      for (let i=0; i<extensions.length; i++) {
        extension = extensions[i]
        if (device[CODECS[extension]]) {
          break
        }
      }
      url = url.replace(groups[1], extension)
    }

    return url
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
    return this._sounds.create(
      resource.rawData,
      resource.metadata
    )
  }
}

module.exports = AudioMiddleware