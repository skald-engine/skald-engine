
let profiles = {}
let stack = []

function begin(id) {
  stack.push(id)
  id = stack.join('.')

  if (!profiles[id]) {
    profiles[id] = {
      label   : id,
      current : null,
      executions: 0,
      average: 0,
      minimum: 0,
      maximum: 0
    }
  }
  profiles[id].current = performance.now()
}
function end(rid) {
  let id = stack.join('.')

  if (!profiles[id] || rid !== stack[stack.length-1]) {
    throw new Error(`Trying to finish an unknown profile "${id}".`)
  }

  let p = profiles[id]
  let t = performance.now()-p.current
  p.executions++
  p.average += (t-p.average)/p.executions
  p.minimum = p.executions===1? t:Math.min(p.average, t)
  p.maximum = p.executions===1? t:Math.max(p.average, t)
  stack.pop()
}
function clear() {
  profiles = {}
}

function report() {
  let groups = {}

  if (!Object.keys(profiles).length) {
    console.log('nothing to report!')
    return
  }

  Object
    .keys(profiles)
    .map(id => {
      let profile = profiles[id]
      let history = profile.history

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


  const colors = {
    base: 'color: #000; font-weight: normal',
    executions: 'color: #C4C4C4; font-weight: normal',
    label: 'color: #000; font-style: italic; font-weight: normal',
    value: 'color: #000; font-weight: bold'
  }
  function recursiveReport(items, tab=0) {
    const supportGroup = !!console.group

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
          `%c${padding}${printableId}  %conce %caverage:%c${formatFloat(item.average)}%cms`,
          colors.base,
          colors.executions,
          colors.label,
          colors.value,
          colors.label,
        )
      } else {
        let x1 = formatInt(item.executions)
        let x2 = formatFloat(item.average)
        let x3 = formatFloat(item.minimum)
        let x4 = formatFloat(item.maximum)

        logFunction(
          `%c${padding}${printableId} %c${x1}x %caverage:%c${x2}%cms %cmin:%c${x3}%cms %cmax:%c${x4}%cms`,
          colors.base,
          colors.executions,
          colors.label, colors.value, colors.label,
          colors.label, colors.value, colors.label,
          colors.label, colors.value, colors.label,
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

function formatInt(i, s=4, c=' ') {
  var r = '' + i
  while (r.length < s) r = c + r
  return r
}
function formatFloat(x, s=6) {
  return x.toFixed(s).replace(/\.?0*$/,'');
}


export {begin, end, clear, report}