const MAX_CONSOLE_ITEMS = 100

/**
 * Replace the default console log functions.
 */
{
  const log = console.log
  const info = console.info
  const warn = console.warn
  const error = console.error

  console.log = (...args) => {
    skf.console.log(...args)
    log.call(this, ...args)
  }
  console.info = (...args) => {
    skf.console.info(...args)
    info.call(this, ...args)
  }
  console.warn = (...args) => {
    skf.console.warn(...args)
    warn.call(this, ...args)
  }
  console.error = (...args) => {
    skf.console.error(...args)
    error.call(this, ...args)
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

        let itemElement = document.createElement('div')
        itemElement.className = `sk-console-item sk-console-item-${type}`
        itemElement.innerHTML = args.join(' ')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/\n/g, '<br/>')
                                    .replace(/\s/g, '&nbsp;')
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