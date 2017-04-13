/**
 * Middleware to load RAW files (i.e., the raw data without any convertions).
 */
export default function rawMiddleware(game) {
  return function(resource, next) {

    // Check for the RAW in metadata type
    if (resource.metadata.type !== 'raw') {
      return next()
    }

    // Check for the data integrity
    if (!resource.data) {
      resource.error = `Invalid raw file.`
      return next()
    }

    // Save the data
    resource.raw = resource.data

    // Cache the resource
    game.resources.cacheResource(
      resource.name,
      resource.url,
      resource.raw,
      resource.metadata
    )

    next()
  }
} 