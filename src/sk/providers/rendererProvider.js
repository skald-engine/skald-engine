const pixi = require('pixi.js')
const $ = require('sk/$')
const C = require('sk/constants')

function rendererProvider() {
  let injector = $.getInjector()
  const config = injector.resolve('config')

  parent = config.get('parent', document.body)
  if (typeof parent === 'string') {
    parent = document.getElementById(parent)
  }

  // get the proper pixi renderer
  let renderers = {
    [C.RENDERERS.AUTO]   : pixi.autoDetectRenderer,
    [C.RENDERERS.WEBGL]  : pixi.WebGLRenderer,
    [C.RENDERERS.CANVAS] : pixi.CanvasRenderer,
  }

  // create the pixi renderer
  let color = config.get('display.background_color')
  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      color = config.get('display.background_color').substring(1)
    }
    color = parseInt(color, 16)
  }

  let renderer = new renderers[config.get('display.renderer')]({
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
  renderer.view.style.userSelect = 'none'
  setTimeout(() => renderer.view.focus(), 1)

  // add the renderer to the html
  parent.appendChild(renderer.view)

  return renderer
}

module.exports = rendererProvider