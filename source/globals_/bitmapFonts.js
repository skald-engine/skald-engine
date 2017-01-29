
export let bitmapFonts = {}

export function addBitmapFont(fontName, data) {
  bitmapFonts[fontName] = data
  PIXI.BitmapText.fonts[fontName] = data;
}