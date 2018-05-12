const C = require('sk/constants')
const $ = require('sk/$')
const Resource = require('sk/core/Resource')
const Middleware = require('sk/core/Middleware')
const pixi = require('pixi.js')

class BitmapFontMiddleware extends Middleware {
  setup() {
    super.setup()
    this._config = $.getInjector().resolve('config')
    this._resources = $.getInjector().resolve('resources')
    this._device = $.getInjector().resolve('device')
  }

  validate(resource) {
    if (!resource.rawData.getElementsByTagName) return false

    let tagPage = resource.rawData.getElementsByTagName('page')
    let tagInfo = resource.rawData.getElementsByTagName('info')
    
    return tagPage.length !== 0 &&
           tagInfo.length !== 0 &&
           tagInfo[0].getAttribute('face') !== null
  }

  process(resource) {
    // get texture url
    let textureUrl = this._getTextureUrl(resource)

    // check if texture already exists
    let textureResource = this._resources.getResourceByUrl(textureUrl)
    if (textureResource) {
      let data = this._parse(resource, textureResource)
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
  }

  cache(resource) {
    let textureResource = resource.children[0]
    pixi.BaseTexture.addToCache(textureResource.data.baseTexture, textureResource.id)
    pixi.BaseTexture.addToCache(textureResource.data.baseTexture, textureResource.url)
    pixi.Texture.addToCache(textureResource.data, textureResource.id)
    pixi.Texture.addToCache(textureResource.data, textureResource.url)

    pixi.extras.BitmapText.fonts[resource.data.font] = resource.data;
  }

  unload(resource) {
    let textureResource = resource.children[0]
    pixi.Texture.removeFromCache(textureResource.data)
    pixi.BaseTexture.removeFromCache(textureResource.data.baseTexture)

    delete pixi.extras.BitmapText.fonts[resource.data.font]
  }

  _getTextureUrl(resource) {
    let tagPage = resource.rawData.getElementsByTagName('page')
    let tagInfo = resource.rawData.getElementsByTagName('info')
    let urlItems = resource.url.replace(/\/*$/g, '').split('/')
    let baseUrl = resource.url.replace(urlItems.pop(), '')
    let pruneLength = this._config.get('resources.base_path', '').length
    baseUrl = baseUrl.substring(pruneLength)
    return baseUrl+tagPage[0].getAttribute('file')
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
      C.RESOURCES.TEXTURE,
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

  _parse(xmlResource, textureResource) {
    let tagInfo   = xmlResource.rawData.getElementsByTagName('info')[0]
    let tagCommon = xmlResource.rawData.getElementsByTagName('common')[0]
    let letters   = xmlResource.rawData.getElementsByTagName('char')
    let kernings  = xmlResource.rawData.getElementsByTagName('kerning')
    let res = pixi.utils.getResolutionOfUrl(textureResource.url, this._device.pixelRatio);

    let data = {
      font       : tagInfo.getAttribute('face'),
      size       : parseInt(tagInfo.getAttribute('size'), 10),
      lineHeight : parseInt(tagCommon.getAttribute('lineHeight'), 10) / res,
      chars      : {}
    }

    for (let i=0; i<letters.length; i++) {
      let charCode = parseInt(letters[i].getAttribute('id'), 10)
      let textureRect = new pixi.Rectangle(
        (parseInt(letters[i].getAttribute('x'), 10) / res) + textureResource.data.frame.x,
        (parseInt(letters[i].getAttribute('y'), 10) / res) + textureResource.data.frame.y,
        parseInt(letters[i].getAttribute('width'), 10) / res,
        parseInt(letters[i].getAttribute('height'), 10) / res
      )

      data.chars[charCode] = {
        xOffset  : parseInt(letters[i].getAttribute('xoffset'), 10) / res,
        yOffset  : parseInt(letters[i].getAttribute('yoffset'), 10) / res,
        xAdvance : parseInt(letters[i].getAttribute('xadvance'), 10) / res,
        kerning  : {},
        texture  : new pixi.Texture(textureResource.data.baseTexture, textureRect),
      }
    }

    for (let i=0; i<kernings.length; i++) {
      let first  = parseInt(kernings[i].getAttribute('first'), 10) / res
      let second = parseInt(kernings[i].getAttribute('second'), 10) / res
      let amount = parseInt(kernings[i].getAttribute('amount'), 10) / res

      if (data.chars[second]) {
        data.chars[second].kerning[first] = amount
      }
    }

    return data
  }
}

module.exports = BitmapFontMiddleware