export default {
  project      : 'skald_game',
  version      : '1.0.0',
  parent       : null,
  autoStart    : true,
  autoUpdate   : true,
  autoPreload  : true,
  startScene   : null,
  preloadScene : 'skald.scenes.preloadDefault',
  manifest     : [],

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
    backgroundColor     : '#1D97F9',
    resolution          : 1,
    antialias           : true,
    transparent         : false, 
    forceFXAA           : false,
    roundPixels         : false,
  },

  events: {
    logEvents: false,
  },

  resources: {
    basePath       : '',
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
    allowEvents        : true,
    preventDefaults    : true,
    rightStickDeadzone : 0.25,
  },

  sounds: {
    masterVolume: 1
  }

}