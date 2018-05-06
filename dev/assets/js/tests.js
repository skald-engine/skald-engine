const MAX_CONSOLE_ITEMS = 100
const MAX_MESSAGE_LENGTH = 100
const MAX_TOOLTIP_LENGTH = 800


/**
 * Replace the default console log functions.
 */
{
  const console_log = console.log
  const console_info = console.info
  const console_warn = console.warn
  const console_error = console.error

  console.log = (...args) => {
    skf.console.log(...args)
    console_log.call(this, ...args)
  }
  console.info = (...args) => {
    skf.console.info(...args)
    console_info.call(this, ...args)
  }
  console.warn = (...args) => {
    skf.console.warn(...args)
    console_warn.call(this, ...args)
  }
  console.error = (...args) => {
    skf.console.error(...args)
    console_error.call(this, ...args)
  }
}


/**
 * Global and variables
 */
{
  const consoleElement = document.getElementById('sk-console')
  const optionsElement = document.getElementById('sk-options')
  const gui = new dat.GUI({
    autoPlace: false,
    width: "100%"
  })
  optionsElement.appendChild(gui.domElement)

  const convert = (s, newline=false) => {
    s = s.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/'/g, '&apos;')
         .replace(/"/g, '&quot;')

    if (newline) {
      s = s.replace(/\n/g, '<br/>')
           .replace(/\s/g, '&nbsp;')
    }

    return s 
  }

  window.skf = {
    options: {
      _gui: gui,

      add: (...args) => {
        return gui.add(...args)
      },

      addFolder: (...args) => {
        return gui.addFolder(...args)
      }
    },

    console: {
      add: (type='log', ...args) => {
        // Remove items first
        if (consoleElement.children.length >= MAX_CONSOLE_ITEMS-1) {
          consoleElement.removeChild(consoleElement.childNodes[0])
        }

        completeMessage = args.map(x => {
          if (Array.isArray(x)) {
            return `[${x.join(', ')}]`

          } else if (typeof x === 'object') {
            let pairs = Object.keys(x).map(y => `${y}:${x[y]}`)
            return JSON.stringify(x, undefined, 4)//`{${pairs.join(', ')}}`
          
          } else {
            return `${x}`
          }
        }).join(' ')

        shortMessage = completeMessage
        if (completeMessage.length > MAX_MESSAGE_LENGTH) {
          shortMessage = completeMessage.substring(0, MAX_MESSAGE_LENGTH - 4) + ' ...'
        }
        if (completeMessage.length > MAX_TOOLTIP_LENGTH) {
          completeMessage = completeMessage.substring(0, MAX_TOOLTIP_LENGTH - 4) + ' ...'
        }
        let same = shortMessage === completeMessage
        shortMessage = convert(shortMessage)
        completeMessage = convert(completeMessage, true)

        let itemElement = document.createElement('div')
        itemElement.className = `item item-${type}`
        if (same) {
          itemElement.innerHTML = `${completeMessage}`
        } else {
          itemElement.innerHTML = `<span uk-tooltip="title: ${completeMessage}; delay: 500">${shortMessage}</span>`
        }
        consoleElement.appendChild(itemElement)
        consoleElement.scrollTop = consoleElement.scrollHeight;
      },
      log: (...args) => {
        skf.console.add('log', ...args)
      },
      info: (...args) => {
        skf.console.add('info', ...args)
      },
      warn: (...args) => {
        skf.console.add('warn', ...args)
      },
      error: (...args) => {
        skf.console.add('error', ...args)
      },
    },

    results: {

    }
  }
}


/**
 * Change skald default configuration
 */
{
  sk.config.defaults['parent'] = 'sk-game'
  sk.config.defaults['logger.level'] = 'debug'
}


/**
 * Capture global errors
 */
{
  window.onerror = (message) => {
    skf.console.error(`[unhandled error] ${message}`)
  }
}