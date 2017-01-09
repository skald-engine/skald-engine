export default {
  type: 'array',
  minItems: 1,
  uniqueItems: true,
  items: {
    type: 'Object',
    required: ['id', 'offset', 'duration'],
    properties: {
      id            : { type: 'string', minLength: 1 },
      offset        : { type: 'number', minimum: 0 },
      duration      : { type: 'number', minimum: 0 },
      volume        : { type: 'number', minimum: 0, maximum: 1 },
      loop          : { type: 'boolean' },
      allowMultiple : { type: 'boolean' }
    }
  }
}