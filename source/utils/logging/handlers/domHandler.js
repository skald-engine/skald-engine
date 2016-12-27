import {LOGGER_LEVEL} from 'core/constants'

const ELEMENT_ID = 'SKALD-LOGGER-'+Math.random().toString(16).substring(2)

/**
 * Not yet implemented.
 *
 * @param {String} message - The message string.
 * @param {LOGGER_LEVEL} level - The logger level.
 */
export default function domHandler(message, level) {
  let element = document.getElementById(ELEMENT_ID)
  if (!element) {
    element = createElement()
  }

  createParagraph(element, message, level)
  pruneChildren(element)
}


function createElement() {
  let container = document.createElement('div')
  container.setAttribute('id', ELEMENT_ID)
  container.style['position'] = 'fixed'
  container.style['bottom'] = '0'
  container.style['left'] = '0'
  container.style['right'] = '0'
  container.style['height'] = '30px'
  container.style['padding'] = '10px'
  container.style['border-top'] = '10px solid #565656'
  container.style['background'] = '#e3e3e3'
  container.style['overflow'] = 'auto'
  document.body.appendChild(container)

  container.onclick = function() {
    if (container.style['height'] === '30px') {
      container.style['height'] = '30vw'
    } else {
      container.style['height'] = '30px'
    }
  }

  return container
}

function createParagraph(element, text, level) {
  let p = document.createElement('p')
  p.innerHTML = `[${level.toUpperCase()}] ${text}`
  p.style['font-family'] = 'monospace'
  p.style['font-size'] = '10pt'
  
  if (level === LOGGER_LEVEL.ERROR || level === LOGGER_LEVEL.FATAL){
    p.style['color'] = '#832918'
  }

  else if (level === LOGGER_LEVEL.WARN) {
    p.style['color'] = '#EC9612'
  }

  else if (level === LOGGER_LEVEL.DEBUG || level === LOGGER_LEVEL.TRACE) {
    p.style['color'] = '#A0A0A0'
  }

  element.insertBefore(p, element.firstChild)
}

function pruneChildren(element) {
  if (element.children.length > 100) {
    let children = Array.from(element.children).slice(100)
    for (let i=0; i<children.length; i++) {
      element.removeChild(children[i])
    }
  }
}