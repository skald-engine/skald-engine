export default {
  project    : 'skald_game',
  version    : 'v1.0.0',
  parent     : null,

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
    namespace: null, // uses project name
  }
}
