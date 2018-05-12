import {enumeration} from 'sk/utils'

/**
 * Resources types
 */
export const RESOURCES = enumeration({
  RAW          : 'raw',
  JSON         : 'json',
  TEXTURE      : 'texture',
  BITMAP_FONT  : 'bitmap_font',
  AUDIO        : 'audio',
  AUDIO_SPRITE : 'audio_sprite',
  SPRITE_SHEET : 'sprite_sheet',
})