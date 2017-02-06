
let profiles = {}

function begin(id) {
  if (!profiles[id]) {
    profiles[id] = {
      label   : id,
      current : null,
      history : []
    }
  }
  profiles[id].current = performance.now()
}
function end(id) {
  if (!profiles[id]) {
    throw new Error(`Trying to finish an unknown profile "${id}".`)
  }

  let p = profiles[id]
  p.history.push(performance.now()-p.current)
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
      item.executions = history.length
      item.average = history.reduce((a,b)=>a+b)/history.length
      item.minimum = history.reduce((a,b)=>Math.min(a,b))
      item.maximum = history.reduce((a,b)=>Math.max(a,b))
    })


  const colors = {
    executions: 'color: #C4C4C4',
    label: 'color: #000; font-style: italic',
    value: 'color: #000; font-weight: bold'
  }
  function recursiveReport(items, i=0) {
    let ids = Object.keys(items)
    let padding = Array(i).join(' ')

    let largestSize = ids.map(x=>x.length)
                         .reduce((a,b)=>Math.max(a,b))

    for (let i=0; i<ids.length; i++) {
      let id = ids[i]
      let item = items[id]

      let printableId = id + Array(largestSize-id.length+1).join(' ')

      if (item.executions === 1) {
        console.log(
          `${padding}${printableId} %conce %caverage:%c${formatFloat(item.average)}%cms`,
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

        console.log(
          `${padding}${printableId}%c${x1}x %caverage:%c${x2}%cms %cmin:%c${x3}%cms %cmax:%c${x4}%cms`,
          colors.executions,
          colors.label, colors.value, colors.label,
          colors.label, colors.value, colors.label,
          colors.label, colors.value, colors.label,
        )
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