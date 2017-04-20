// Sub namespace elements
import * as $ from 'sk/$'
import * as utils from 'sk/utils'
import * as config from 'sk/config'
import * as core from 'sk/core'
import * as events from 'sk/events'
import * as managers from 'sk/managers'
import * as middlewares from 'sk/middlewares'
import * as displayObjects from 'sk/displayObjects'
import * as audio from 'sk/audio'
export {$, utils, config, audio, events, core, managers, middlewares, 
        displayObjects}

// Global namespace elements
export * from 'sk/constants'
export * from 'sk/entity'
export * from 'sk/component'
export * from 'sk/system'
export * from 'sk/scene'
export * from 'sk/eventSheet'
export * from 'sk/registerDisplayObject'
export * from 'sk/registerLoggerFormatter'
export * from 'sk/registerLoggerHandler'
export * from 'sk/registerBitmapFont'
export * from 'sk/setAudioSystems'

import Game from 'sk/Game'
export {Game}

