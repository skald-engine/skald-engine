const sk = require('sk')

function rendererProvider() {
  const config = sk.inject('config')
  const pixi = sk.inject('pixi')

  parent = document.body
  if (config.get('parent')) {
    parent = document.getElementById(config.get('parent'))
  }

  // get the proper pixi renderer
  let renderers = {
    [sk.RENDERER.AUTO]   : pixi.autoDetectRenderer,
    [sk.RENDERER.WEBGL]  : pixi.WebGLRenderer,
    [sk.RENDERER.CANVAS] : pixi.CanvasRenderer,
  }

  // create the pixi renderer
  let color = config.get('display.background_color')
  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      color = config.get('display.background_color').substring(1)
    }
    color = parseInt(color, 16)
  }

  renderer = new renderers[config.get('display.renderer')]({
    width           : config.get('display.width'),
    height          : config.get('display.height'),
    resolution      : config.get('display.resolution'),
    backgroundColor : color,
    antialias       : config.get('display.antialias'),
    transparent     : config.get('display.transparent'),
    forceFXAA       : config.get('display.force_FXAA'),
    roundPixels     : config.get('display.round_pixels'),
  })

  // enable focus on the game
  renderer.view.setAttribute('tabindex', '1')
  renderer.view.focus()

  // add the renderer to the html
  parent.appendChild(renderer.view)

  return renderer
}

module.exports = rendererProvider