export default function audioSpriteMiddleware(game) {
  return function(resource, next) {
    if (resource.metadata.type !== 'audiosprite') {
      return next()
    }

    if (!resource.data) {
      resource.error = `Invalid audio file.`
      return next()
    }

    let audios = []
    for (let i=0; i<resource.metadata.data.length; i++) {
      let data = resource.metadata.data[i]

      let audio = game.sounds.createAudio(
        data.id,
        resource.data,
        data
      )
      
      game.resources.cacheResource(
        data.id,
        audio,
        resource.metadata
      )

      audios.push(audio)
    }

    resource.audios = audios
    next()
  }
} 
