const COLORS = require('sk/constants/colors').COLORS

module.exports = {
  'project' : 'skald_name',
  'version' : '1.0.0',
  'parent'  : null,
  
  'logger.level'     : 'debug',
  'logger.handler'   : 'console',
  'logger.formatter' : 'simple',
  
  'display.renderer'              : 'webgl',
  'display.width'                 : 800,
  'display.height'                : 600,
  'display.min_width'             : null,
  'display.max_width'             : null,
  'display.min_height'            : null,
  'display.max_height'            : null,
  'display.force_orientation'     : null,
  'display.scale_mode'            : 'noscale',
  'display.fullscreen_scale_mode' : 'noscale',
  'display.background_color'      : COLORS.SK_BLACK,
  'display.resolution'            : 1,
  'display.antialias'             : true,
  'display.transparent'           : false, 
  'display.force_FXAA'            : false,
  'display.round_pixels'          : true,

  'resources.base_path'       : null,
  'resources.max_concurrency' : 10,

  'keyboard.prevent_default' : false,
  'mouse.prevent_default'    : false,
  'sounds.master_volume'     : 1,
}