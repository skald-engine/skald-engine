// Map of profiles and execution information. A profile holds the information 
// about `label` (profile id), `current` (unix-format time when this profile 
// was last started), `executions` (with the number of times this profile were
// used), `average` (the average time used in this profile), `minimum` (the 
// minimum time used in this profile), and `maximum` (with the largest time 
// spent running this profile).
let _profiles = {}

// The profiling stack is a list of all started-but-not-finished profiles. 
// These profiles are concatenated with a '.' between each item, so it can 
// save the hierarchy information. For example, if you start a profile with 
// `gameupdate` id, and inside the update function you call a function that
// starts a profile `updatescene`, then you will have the profiles 
// `gameupdate.updatescene` counting only the time of the nested function, and 
// a `gameupdate` profile with the total time of the update function (counting
// the update scene as part of it).
let _stack = []

// Format an int with a fixed number of digits
function _formatInt(i, s=4, c=' ') {
  var r = '' + i
  while (r.length < s) r = c + r
  return r
}

// Format a float with fixed number of digits
function _formatFloat(x, s=6) {
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
function begin(id) {
  _stack.push(id)
  id = _stack.join('.')

  // create a new profile if there is no one with the provided ID
  if (!_profiles[id]) {
    _profiles[id] = {
      label      : id,
      current    : null,
      executions : 0,
      average    : 0,
      minimum    : 0,
      maximum    : 0
    }
  }
  _profiles[id].current = performance.now()
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
 * @param {String} _id The profile ID.
 * @throws {Error} If trying finish an unstarted profile.
 */
function end(_id) {
  let id = _stack.join('.')

  // If profile does not exist 
  if (!_profiles[id] || _id !== _stack[_stack.length-1]) {
    throw new Error(`Trying to finish an unknown profile "${id}".`)
  }

  let p = _profiles[id]
  let t = performance.now()-p.current
  p.executions++
  p.average += (t-p.average)/p.executions
  p.minimum = p.executions===1? t:Math.min(p.average, t)
  p.maximum = p.executions===1? t:Math.max(p.average, t)
  _stack.pop()
}

/**
 * Clear all profiles and resets the stack. If you call this function after 
 * starting a profile, you won't be able to call `end` (it will result into an
 * exception).
 */
function clear() {
  _profiles = {}
  _stack = []
}

/**
 * Prints the result of all registered profiles into console.
 */
function report() {
  let groups = {}

  // No profile to report
  if (!Object.keys(_profiles).length) {
    console.log('nothing to report!')
    return
  }

  // Loop through the profiles to organize them into a tree format
  Object
    .keys(_profiles)
    .map(id => {
      let profile = _profiles[id]

      let path = id.split('.')
      let parent = groups
      let item = null

      for (let i=0; i<path.length; i++) {
        let itemId = path[i]
        
        if (!parent[itemId]) {
          parent[itemId] = {
            children: {}
          }
        }
        item = parent[itemId]
        parent = item.children
      }

      item.label = profile.label
      item.executions = profile.executions
      item.average = profile.average
      item.minimum = profile.minimum
      item.maximum = profile.maximum
    })

  // console report styles
  const colors = {
    base       : 'color: #000; font-weight: normal',
    executions : 'color: #C4C4C4; font-weight: normal',
    label      : 'color: #000; font-style: italic; font-weight: normal',
    value      : 'color: #000; font-weight: bold'
  }

  // helper function to print the computed tree
  function recursiveReport(items, tab=0) {
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
      
      if (item.executions === 1) {
        logFunction(
          `%c${padding}${printableId}  %conce %caverage:%c${_formatFloat(item.average)}%cms`,
          colors.base,
          colors.executions,
          colors.label,
          colors.value,
          colors.label
        )
      } else {
        let x1 = _formatInt(item.executions)
        let x2 = _formatFloat(item.average)
        let x3 = _formatFloat(item.minimum)
        let x4 = _formatFloat(item.maximum)

        logFunction(
          `%c${padding}${printableId} %c${x1}x %caverage:%c${x2}%cms %cmin:%c${x3}%cms %cmax:%c${x4}%cms`,
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


module.exports = {
  begin,
  end,
  clear,
  report
}