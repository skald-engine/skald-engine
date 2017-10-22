module.exports = {
  project      : 'skald_game',
  version      : '1.0.0',
  parent       : null,
  autoStart    : true, // TODO: CHECK IF WE ARE USING IT
  autoUpdate   : true, // TODO: CHECK IF WE ARE USING IT
  autoPreload  : true, // TODO: CHECK IF WE ARE USING IT
  manifest     : [],   // TODO: CHECK IF WE ARE USING IT

  logger: {
    level     : 'debug',
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
    usePool: true,
  },

  pool: {
    maxSize: 10,
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