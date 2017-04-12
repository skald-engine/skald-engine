import deepMerge from 'utils/functions/deepMerge'
import jsen from 'dependencies'

/**
 * Set defaults and validate a json object. This functions uses JSEN library to
 * validate the input object, if you are using the skald lite library, you must
 * include JSEN manually.
 *
 * See:
 *
 * - [JSEN site](https://github.com/bugventure/jsen)
 * - [Json-schema specification](http://json-schema.org/documentation.html)
 * - [Json-schema JSEN guide](http://bugventure.github.io/jsen/json-schema)
 *
 * @param {Object} json - The json object.
 * @param {Object} [defaults] - A valid object with default values. It 
 *        will be used to replace any missing value from the json object.
 * @param {Object} [schema] - The json-schema object.
 * @return {Object} A final object with all valid configuration values.
 * @throws {Error} If the json is invalid accondingly to the provided schema.
 */
export default function validateJson(json, defaults, schema) {
  if (!json) {
    throw Error(`Invalid json object.`)
  }

  // Set defaults if provided
  if (defaults) {
    json = deepMerge(defaults, json)
  }

  // Validates the json if schema is provided
  if (schema) {
    let validate = jsen(schema)
    let isValid = validate(json)

    if (!isValid) {
      console.error(validate.errors)
      throw new Error(`Invalid json, check the console to see more details.`)
    }  
  }

  return json
}