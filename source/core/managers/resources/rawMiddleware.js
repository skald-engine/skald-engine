export default function rawMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'raw') {
      return next()
    }

    if (!resource.data) {
      resource.error = `Invalid raw file.`
      return next()
    }

    resource.raw = resource.data

    game.resources.cacheResource(
      resource.name,
      resource.raw,
      resource.metadata
    )

    next()
  }
} 
