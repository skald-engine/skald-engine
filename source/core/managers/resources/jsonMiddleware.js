export default function jsonMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'json') {
      return next()
    }

    if (!resource.data) {
      resource.error = `Invalid audio file.`
      return next()
    }

    resource.json = resource.data

    game.resources.cacheResource(
      resource.name,
      resource.json,
      resource.metadata
    )

    next()
  }
} 
