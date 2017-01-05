export default function audioMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'audio') {
      return next()
    }

    if (!resource.data) {
      resource.error = `Invalid audio file.`
      return next()
    }

    resource.audio = game.sounds.createAudio(
      resource.name,
      resource.data,
      resource.metadata.data
    )

    game.resources.cacheResource(
      resource.name,
      resource.audio,
      resource.metadata
    )

    next()
  }
} 
