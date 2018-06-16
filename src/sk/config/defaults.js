const COLORS = require('sk/constants/colors').COLORS

module.exports = {
  // GENERAL ==========================================================
  'project' : 'skald_name',
  'version' : '1.0.0',
  'parent'  : null,
  
  // MANAGERS =========================================================
  'display.enabled'               : true,
  'display.renderer'              : 'webgl',
  'display.width'                 : 800,
  'display.height'                : 600,
  'display.force_orientation'     : null,
  'display.scale_mode'            : 'noscale',
  'display.fullscreen_scale_mode' : 'noscale',
  'display.background_color'      : COLORS.SK_BLACK,
  'display.resolution'            : 1,
  'display.antialias'             : true,
  'display.transparent'           : false, 
  'display.force_FXAA'            : false,
  'display.round_pixels'          : true,
  'display.parent_scale'          : false,
  
  'gamepads.enabled'              : true,
  'gamepads.left_stick_deadzone'  : 0.25,
  'gamepads.right_stick_deadzone' : 0.25,
  
  'keyboard.enabled'              : true,
  'keyboard.prevent_default'      : false,
  
  'mouse.enabled'                 : true,
  'mouse.prevent_default'         : false,
  
  'touches.enabled'               : true,
  'touches.prevent_defaults'      : false,
  
  'sounds.enabled'                : true,
  'sounds.master_volume'          : 1,

  'schedule.enabled'              : true,
  'signals.enabled'               : true,
  'time.enabled'                  : true,
  'views.enabled'                 : true,

  // SERVICES ========================================================
  'resources.enabled'         : true,
  'resources.base_path'       : null,
  'resources.max_concurrency' : 10,
  
  'logger.enabled'            : true,
  'logger.level'              : 'debug',
  'logger.handler'            : 'console',
  'logger.formatter'          : 'simple',

  'profile.enabled'           : true,
  'sounds.enabled'            : true,
}