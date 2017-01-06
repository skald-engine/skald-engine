
/**
 * List of audio systems.
 */
export let audioSystems = []

/**
 * Sets the audio systems. Check {@link SoundsManager} to know more.
 *
 * @param {Array<AudioSystems>} systems - The list of audio systems.
 */
export function setAudioSystems(systems) {
  audioSystems.splice(0, audioSystems.length)
  for (let i=0; i<systems.length; i++) {
    audioSystems.push(systems[i])
  }
}