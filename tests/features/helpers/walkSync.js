const fs = require('fs')
const path = require('path')

function walkSync(directory, base) {
  base = base || directory
  let results = []

  fs.readdirSync(directory)
    .forEach((item => {
      let itemPath = path.join(directory, item)

      if (fs.statSync(itemPath).isDirectory()) {
        results = results.concat(walkSync(itemPath, base))
      } else {
        results.push(itemPath.substring(base.length))
      }
    }))

  return results.map(x => x.replace(/\\/g, '/'))
                .sort(_sort)
}

function _sort(a, b) {
  let dirsA = (a.match(/\//g)||[]).length
  let dirsB = (b.match(/\//g)||[]).length

  if (dirsA < dirsB) return -1
  if (dirsA > dirsB) return 1
  if (a < b) return -1
  if (a > b) return 1

  return 0
}


module.exports = walkSync
