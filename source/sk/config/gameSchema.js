import * as c from 'sk/constants'

export default {
  type: 'object',
  required: [
    'project',
    'version',
    'parent',
    'autoUpdate',
    'autoPreload',
    'autoStart',
    'manifest',
    'logger',
    'managers',
    'display',
    'events',
    'pool',
    'resources',
    'storage',
    'mouse',
    'keyboard',
    'gamepads',
    'sounds'
  ],
  properties: {
    // Base
    project      : { type: 'string' },
    version      : { type: 'string' },
    parent       : { type: ['string', 'null'] },
    autoUpdate   : { type: 'boolean' },
    autoPreload  : { type: 'boolean' },
    autoStart    : { type: 'boolean' },
    manifest     : { type: 'array' },
    
    // Logger
    logger: {
      type: 'object',
      required: ['level', 'handler'],
      properties: {
        level     : { type: 'string', enum: c.LOGGER_LEVEL.values() },
        handler   : { type: 'string' },
        formatter : { type: 'string' },
      }
    },
    
    // Display
    display: {
      type: 'object',
      required: [
        'renderer',
        'width',
        'height',
        'minWidth',
        'maxWidth',
        'minHeight',
        'maxHeight',
        'forceOrientation',
        'scaleMode',
        'fullscreenScaleMode',
        'backgroundColor',
        'antialias',
        'transparent',
        'forceFXAA',
        'roundPixels',
      ],
      properties: {
        renderer            : { type: 'string', enum: c.RENDERER.values() },
        width               : { type: 'integer', minimum: 0 },
        height              : { type: 'integer', minimum: 0 },
        minWidth            : { type: ['integer', 'null'], minimum: 0 },
        maxWidth            : { type: ['integer', 'null'], minimum: 0 },
        minHeight           : { type: ['integer', 'null'], minimum: 0 },
        maxHeight           : { type: ['integer', 'null'], minimum: 0 },
        forceOrientation    : { anyOf: [
                                { type: 'string', enum: c.ORIENTATION.values() },
                                { type: 'null' }
                              ]},
        scaleMode           : { type: 'string', enum: c.SCALE_MODE.values() },
        fullscreenScaleMode : { type: 'string', enum: c.SCALE_MODE.values() },
        resolution          : { type: 'integer', minimum: 1 },
        backgroundColor     : { type: 'string' },
        antialias           : { type: 'boolean' },
        transparent         : { type: 'boolean' },
        forceFXAA           : { type: 'boolean' },
        roundPixels         : { type: 'boolean' },
      }
    },

    events: {
      type: 'object',
      required: [
        'logEvents'
      ],
      properties: {
        logEvents: {type: 'boolean'},
        userPool: {type: 'boolean'}
      }
    },

    pool: {
      type: 'object',
      required: [
        'maxSize'
      ],
      properties: {
        maxSize: {type: 'integer', minimum: 0}
      }
    },

    resources: {
      type: 'object',
      required: [
        'basePath',
        'maxConcurrency'
      ],
      properties: {
        basePath       : { type: ['string', 'null'] },
        maxConcurrency : { type: 'integer', minimum: 0 },
      }
    },

    keyboard: {
      type: 'object',
      required: [
        'allowEvents',
        'preventDefaults'
      ],
      properties: {
        allowEvents : { type: 'boolean' },
        preventDefaults : { type: 'boolean' },
      }
    },

    mouse: {
      type: 'object',
      required: [
        'allowEvents',
        'preventDefaults'
      ],
      properties: {
        allowEvents : { type: 'boolean' },
        preventDefaults : { type: 'boolean' },
      }
    },

    gamepads: {
      type: 'object',
      required: [
        'leftStickDeadzone',
        'rightStickDeadzone',
        'allowEvents',
        'preventDefaults'
      ],
      properties: {
        leftStickDeadzone: { type: 'number', minimum: 0, maximum: 1 },
        rightStickDeadzone: { type: 'number', minimum: 0, maximum: 1 },
        allowEvents: { type: 'boolean' },
        preventDefaults: { type: 'boolean' },
      }
    },

    sounds: {
      type: 'object',
      required: [
        'masterVolume'
      ],
      properties: {
        masterVolume: { type: 'number', minimum: 0, maximum: 1 }
      }
    },

    storage: {
      type: 'object'
    }
  }
}