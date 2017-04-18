const FRAME_REGULAR = {
  type: 'object',
  required: ['width', 'height'],
  properties: {
    width   : {type: 'integer', minimum: 1},
    height  : {type: 'integer', minimum: 1},
    count   : {type: 'integer', minimum: 1},
    spacing : {type: 'integer', minimum: 0},
    margin  : {type: 'integer', minimum: 0},
    anchor: {
      type: 'object',
      properties: {
        x : {type: 'number', minimum: 0},
        y : {type: 'number', minimum: 0},
      }
    },
  }  
}

const FRAME_IRREGULAR = {
  type: 'array',
  items: [
    {
      type: 'object',
      required: ['id', 'rect'],
      properties: {
        id: {type: 'string'},
        rotated: {type: 'boolean'},
        rect: {
          type: 'object',
          required: ['x', 'y', 'width', 'height'],
          properties: {
            x      : {type: 'integer', minimum: 0},
            y      : {type: 'integer', minimum: 0},
            width  : {type: 'integer', minimum: 1},
            height : {type: 'integer', minimum: 1},
          }
        },
        anchor: {
          type: 'object',
          properties: {
            x : {type: 'number', minimum: 0},
            y : {type: 'number', minimum: 0},
          }
        },
      }
    }
  ]
}

const ANIMATION_SIMPLE = {
  type: 'array',
  items: [
    {type: 'integer', minimum: 0},
    {type: 'string'}
  ]
}

const ANIMATION_COMPLETE = {
  type: 'object',
  required: ['frames'],
  properties: {
    frames: {type: 'array', items:{anyOf:[{type:'integer'}, {type:'string'}]}},
    next: {type: 'string'},
    speed: {type: 'number'},
    repeat: {type: 'boolean'}
  }
}

export default {
  type: 'object',
  required: ['image', 'frames', 'framerate', 'resolution'],
  properties: {
    image : {type: 'string', minLength: 1},
    frameRate: {type: 'integer', minimum: 1},
    resolution: {type: 'number'},
    scale: {type: 'number', minimum: 0, exclusiveMinimum: true},
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