import * as globals from 'globals_'

export default function bitmapTextMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'bitmapFont') {
      return next()
    }

    if (!resource.data) {
      resource.error = `Invalid bitmap font file.`
      return next()
    }

    let tagPage = resource.data.getElementsByTagName('page')
    let tagInfo = resource.data.getElementsByTagName('info')
    if (tagPage.length === 0 || tagInfo.length === 0 || tagInfo[0].getAttribute('face') === null) {
      resource.error = `Invalid bitmap font metadata.`
      return next()
    }

    let urlItems = resource.url.replace(/\/*$/g, '').split('/')
    let baseUrl = resource.url.replace(urlItems.pop(), '')
    let textureUrl = baseUrl+tagPage[0].getAttribute('file')

    let texture = game.resources.getUrl(textureUrl)
    if (texture) {
      parse(resource, texture, textureUrl)
      return next()
    } else {
      let Resource = PIXI.loaders.Resource
      let textureId = resource.name+'_texture'
      let options = {
        crossOrigin    : resource.crossOrigin,
        loadType       : Resource.LOAD_TYPE.IMAGE,
        metadata       : resource.metadata.data,
        parentResource : resource,
      }
      game.resources._loader.add(textureId, textureUrl, options, (res) => {

        let url = PIXI.utils.getResolutionOfUrl(textureUrl)
        let baseTexture = new PIXI.BaseTexture(res.data, null, url)
        baseTexture.imageUrl = url
        let texture = new PIXI.Texture(baseTexture)

        PIXI.BaseTextureCache[textureId] = baseTexture
        PIXI.TextureCache[textureId] = texture

        parse(resource, texture, textureUrl)
        return next()
      })
    }
  }

  function parse(resource, texture, textureUrl) {
    let tagInfo = resource.data.getElementsByTagName('info')[0]
    let tagCommon = resource.data.getElementsByTagName('common')[0]
    let letters = resource.data.getElementsByTagName('char')
    let kernings = resource.data.getElementsByTagName('kerning')

    let data = {
      font       : tagInfo.getAttribute('face'),
      size       : parseInt(tagInfo.getAttribute('size'), 10),
      lineHeight : parseInt(tagCommon.getAttribute('lineHeight'), 10),
      chars      : {}
    }

    for (let i=0; i<letters.length; i++) {
      let charCode = parseInt(letters[i].getAttribute('id'), 10)
      let textureRect = new PIXI.Rectangle(
        parseInt(letters[i].getAttribute('x'), 10) + texture.frame.x,
        parseInt(letters[i].getAttribute('y'), 10) + texture.frame.y,
        parseInt(letters[i].getAttribute('width'), 10),
        parseInt(letters[i].getAttribute('height'), 10)
      )

      data.chars[charCode] = {
        xOffset  : parseInt(letters[i].getAttribute('xoffset'), 10),
        yOffset  : parseInt(letters[i].getAttribute('yoffset'), 10),
        xAdvance : parseInt(letters[i].getAttribute('xadvance'), 10),
        kerning  : {},
        texture  : new PIXI.Texture(texture.baseTexture, textureRect),
      }
    }

    for (let i=0; i<kernings.length; i++) {
      let first = parseInt(kernings[i].getAttribute('first'), 10)
      let second = parseInt(kernings[i].getAttribute('second'), 10)
      let amount = parseInt(kernings[i].getAttribute('amount'), 10)

      if (data.chars[second]) {
        data.chars[second].kerning[first] = amount
      }
    }

    resource.bitmapFont = data

    game.resources.cacheResource(
      resource.name,
      resource.url,
      resource.bitmapFont,
      data
    )
    game.resources.cacheResource(
      resource.name+'_texture',
      textureUrl,
      texture,
      data
    )

    globals.addBitmapFont(data.font, data)
  }
} 
