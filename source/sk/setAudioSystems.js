import * as $ from 'sk/$'

export function setAudioSystems(systems) {
  // Clear the audio system list
  $.audioSystems.splice(0, $.audioSystems.length)

  // Adds the provided systems to the list
  for (let i=0; i<systems.length; i++) {
    $.audioSystems.push(systems[i])
  }
}