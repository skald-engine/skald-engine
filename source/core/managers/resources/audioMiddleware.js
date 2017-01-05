export default function audioMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'audio') {
      return next()
    }

    if (!resource.data) {
      resource.error = `Invalid audio file.`
      return next()
    }

    resource.audio = game.sounds.system.createAudio(resource.data)

    game.resources.cacheResource(
      resource.name,
      resource.audio,
      resource.metadata
    )

    next()
  }
} 
