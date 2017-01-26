const FRAME_IRREGULAR = {
  type: 'array',
  items: [
    {
      type: 'object',
      required: ['x', 'y', 'width', 'height'],
      properties: {
        x      : {type: 'integer', minimum: 0},
        y      : {type: 'integer', minimum: 0},
        width  : {type: 'integer', minimum: 1},
        height : {type: 'integer', minimum: 1},
        index  : {type: 'integer', minimum: 0},
        label  : {type: 'string'},
      }
    }
  ]
}

const FRAME_REGULAR = {
  type: 'object',
  required: ['width', 'height'],
  properties: {
    width   : {type: 'integer', minimum: 1},
    height  : {type: 'integer', minimum: 1},
    count   : {type: 'integer', minimum: 1},
    spacing : {type: 'integer', minimum: 0},
    margin  : {type: 'integer', minimum: 0},
    label   : {type: 'string'},
  }  
}

const ANIMATION_SIMPLE = {
  type: 'array'
}

const ANIMATION_COMPLETE = {
  type: 'object',
  required: ['frames'],
  properties: {
    frames: {type: 'array', items:[{type:'integer'}, {type:'string'}]},
    next: {type: 'string'},
    speed: {type: 'number'},
  }
}

export default {
  type: 'object',
  required: ['image', 'frames'],
  properties: {
    image : { type: 'string', minLength: 1 },
    fps: { type: 'integer', minimum: 1 },
    frames : { 
      oneOf: [FRAME_REGULAR, FRAME_IRREGULAR]
    },
    animations : {
      type: 'object',
      additionalProperties: {
        anyOf: [ANIMATION_SIMPLE, ANIMATION_COMPLETE]

      }
    },
  }
}
