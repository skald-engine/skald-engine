export default {
  type: 'object',
  properties: {
    offset        : { type: 'number', minimum: 0 },
    duration      : { type: 'number', minimum: 0 },
    volume        : { type: 'number', minimum: 0, maximum: 1 },
    loop          : { type: 'boolean' },
    allowMultiple : { type: 'boolean' },

    markers: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          offset   : { type: 'number', minimum: 0 },
          duration : { type: 'number', minimum: 0 },
          volume   : { type: 'number', minimum: 0, maximum: 1 },
          loop     : { type: 'boolean' },
        }
      }
    }
  }
}