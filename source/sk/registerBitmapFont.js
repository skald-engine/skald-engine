import * as $ from 'sk/$'

/**
 * Register a bitmap font
 */
export function registerBitmapFont(name, data) {
  if ($.bitmapFonts[name]) {
    throw new Error(`Bitmap font object "${name}" already registered.`)
  }

  $.bitmapFonts[name] = data
  PIXI.BitmapText.fonts[name] = data
}