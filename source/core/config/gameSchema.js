import * as c from 'core/constants'

export default {
  type: 'object',
  required: [
    'project',
    'version',
    'parent',
    'logger',
    'managers',
    'display',
    'resources',
    'storage'
  ],
  properties: {
    // Base
    project : { type: 'string' },
    version : { type: 'string' },
    parent  : { type: ['string', 'null'] },
    
    // Logger
    logger: {
      type: 'object',
      required: ['level', 'handler'],
      properties: {
        level   : { type: 'string' }, //, enum: c.LOGGER_LEVEL.values() 
        handler : { type: 'string' }, //, enum: c.LOGGER_HANDLER.values() 
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

    // resources: {
    //   type: 'object',
    //   required: ['basePath', 'maxConcurrency']
    // },

    // storage: {
    //   type: 'object',
    //   required: ['namescape']
    // }
  }
}