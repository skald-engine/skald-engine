export default {
  project    : 'skald_game',
  version    : '1.0.0',
  parent     : null,
  autoUpdate : true,

  logger: {
    level     : 'warn',
    handler   : 'console',
    formatter : 'simple'
  },

  display : {
    renderer            : 'webgl',
    width               : 800,
    height              : 600,
    minWidth            : null,
    maxWidth            : null,
    minHeight           : null,
    maxHeight           : null,
    forceOrientation    : null,
    scaleMode           : 'noscale',
    fullscreenScaleMode : 'noscale',
    backgroundColor     : '#000000',
    resolution          : 1,
    antialias           : false,
    transparent         : false, 
    forceFXAA           : false,
    roundPixels         : false,
  },

  resources: {
    basePath       : null,
    maxConcurrency : 10,
  },

  storage: {
    namespace : null, // uses project name
  },

  keyboard: {
    allowEvents     : true,
    preventDefaults : true,
  },
  
  mouse: {
    allowEvents     : true,
    preventDefaults : true,
  },

  gamepads: {
    leftStickDeadzone  : 0.25,
    rightStickDeadzone : 0.25,
    allowEvents        : true,
    preventDefaults    : true,
  },

  sounds: {
    masterVolume: 1
  }

}