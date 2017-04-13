/**
 * Middleware to load JSON files into javascript objects.
 */
export default function jsonMiddleware(game) {
  return function(resource, next) {

    // Check for the resource type
    if (resource.metadata.type !== 'json') {
      return next()
    }

    // Check for the data integrity
    if (!resource.data) {
      resource.error = `Invalid json file.`
      return next()
    }

    // Save data
    resource.json = resource.data

    // Cache the data into game resources
    game.resources.cacheResource(
      resource.name,
      resource.url,
      resource.json,
      resource.metadata
    )

    // Done
    next()
  }
} 