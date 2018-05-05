const Service = require('sk/core/Service')

class Profile {
  constructor(label) {
    this.label = label
    this.current = performance.now()
    this.executions = 0
    this.average = 0
    this.minimum = 0
    this.maximum = 0
  }

  update() {
    let time = performance.now() - this.current
    this.executions++
    this.average += (time - this.average)/this.executions
    this.minimum = this.executions === 1? time : Math.min(this.minimum, time)
    this.maximum = this.executions === 1? time : Math.max(this.maximum, time)
  }
}

class ProfileService extends Service {
  constructor() {
    super()

    // Map of profiles and execution information. A profile holds the information 
    // about `label` (profile id), `current` (unix-format time when this profile 
    // was last started), `executions` (with the number of times this profile were
    // used), `average` (the average time used in this profile), `minimum` (the 
    // minimum time used in this profile), and `maximum` (with the largest time 
    // spent running this profile).
    this._profiles = []

    // The profiling stack is a list of all started-but-not-finished profiles. 
    // These profiles are concatenated with a '.' between each item, so it can 
    // save the hierarchy information. For example, if you start a profile with 
    // `gameupdate` id, and inside the update function you call a function that
    // starts a profile `updatescene`, then you will have the profiles 
    // `gameupdate.updatescene` counting only the time of the nested function, and 
    // a `gameupdate` profile with the total time of the update function (counting
    // the update scene as part of it).
    this._stack = [] 
  }

  _formatInt(i, s=4, c=' ') {
    var r = '' + i
    while (r.length < s) r = c + r
    return r
  }

  // Format a float with fixed number of digits
  _formatFloat(x, s=6) {
    return x.toFixed(s).replace(/\.?0*$/,'');
  }

  /**
   * Starts a new profiling run for the provided profile. You will use this 
   * function together with `profiling.end` function, which will finish the run 
   * and save the results.
   *
   * Remember that you must use the same ID for both `begin` and `end` functions,
   * this Id will also be used to `report` the results of the profiling.
   *
   * Usage:
   *
   *     function update() {
   *       sk.utils.profiling.begin('game_update')
   *       ... code ...
   *       sk.utils.profiling.end('game_update')
   *     }
   *
   * than you can call `report`, which will print the result in the console:
   *
   *     sk.utils.profiling.report()
   *
   * 
   * @param {String} id The profile ID.
   */
  begin(id) {
    this._stack.push(id)
    let fullId = this._stack.join('.')

    if (!this._profiles[fullId]) {
      this._profiles[fullId] = new Profile(fullId)
    }
  }

  /**
   * Finishes a profiling run for the provided profile. Notice that you must have
   * the profile started when using this function (and don't forget to call it if
   * you called `begin`). 
   *
   * This function throws an error if you are trying to finish a profile that was
   * not started or if you are trying to finish a profile other than the last one
   * that was started.
   *
   * @param {String} id The profile ID.
   * @throws {Error} If trying finish an unstarted profile.
   */
  end(id) {
    let fullId = this._stack.join('.')

    if (!this._profiles[fullId] || id !== this._stack[this._stack.length-1]) {
      throw new Error(`Trying to finish an unknown profile "${fullId}".`)
    }

    let profile = this._profiles[fullId]
    profile.update()
    this._stack.pop()
  }

  /**
   * Clear all profiles and resets the stack. If you call this function after 
   * starting a profile, you won't be able to call `end` (it will result into an
   * exception).
   */
  clear() {
    this._profiles = {}
    this._stack = []
  }

  /**
   * Prints the result of all registered profiles into console.
   */
  report() {
    // No profile to report
    if (!Object.keys(this._profiles).length) {
      console.log('Nothing to report!')
      return
    }

    let groups = this.toJson()

    // console report styles
    const colors = {
      base       : 'color: #000; font-weight: normal',
      executions : 'color: #C4C4C4; font-weight: normal',
      label      : 'color: #000; font-style: italic; font-weight: normal',
      value      : 'color: #000; font-weight: bold'
    }

    // helper function to print the computed tree
    const recursiveReport = (items, tab=0) => {
      let supportGroup = !!console.group
      let ids = Object.keys(items)
      let padding = supportGroup? '':Array(tab*4).join(' ')
      let largestSize = ids.map(x=>x.length)
                           .reduce((a,b)=>Math.max(a,b))

      for (let i=0; i<ids.length; i++) {
        let id = ids[i]
        let item = items[id]
        let hasChildren = !!Object.keys(item.children).length

        let printableId = id + Array(largestSize-id.length+1).join(' ')

        let logFunction = (...args) => { console.log(...args) }
        if (hasChildren && supportGroup) {
          if (tab <= 1) {
            logFunction = (...args) => { console.group(...args) }
          } else {
            logFunction = (...args) => { console.groupCollapsed(...args) }
          }
        }
        
        if (item.data.executions === 1) {
          logFunction(
            `%c${padding}${printableId}  %conce %cavg:%c${this._formatFloat(item.data.average)}%cms`,
            colors.base,
            colors.executions,
            colors.label,
            colors.value,
            colors.label
          )
        } else {
          let x1 = this._formatInt(item.data.executions)
          let x2 = this._formatFloat(item.data.average)
          let x3 = this._formatFloat(item.data.minimum)
          let x4 = this._formatFloat(item.data.maximum)

          logFunction(
            `%c${padding}${printableId} %c${x1}x %cavg:%c${x2}%cms %cmin:%c${x3}%cms %cmax:%c${x4}%cms`,
            colors.base,
            colors.executions,
            colors.label, colors.value, colors.label,
            colors.label, colors.value, colors.label,
            colors.label, colors.value, colors.label
          )
        }

        if (hasChildren) {
          recursiveReport(item.children, tab+1)
          if (supportGroup) console.groupEnd()
        }
      }
    }
    recursiveReport(groups)
  }

  now() {
    return performance.now()
  }

  toJson() {
    let groups = {}

    // Loop through the profiles to organize them into a tree format
    Object
      .keys(this._profiles)
      .forEach(id => {
        let profile = this._profiles[id]

        let path = id.split('.')
        let parent = groups
        let item = null

        for (let i=0; i<path.length; i++) {
          let itemId = path[i]
          
          if (!parent[itemId]) {
            parent[itemId] = {
              children: {},
              data: {}
            }
          }
          item = parent[itemId]
          parent = item.children
        }

        item.data.label      = profile.label
        item.data.executions = profile.executions
        item.data.average    = profile.average
        item.data.minimum    = profile.minimum
        item.data.maximum    = profile.maximum
      })

    return groups
  }
}

module.exports = ProfileService
