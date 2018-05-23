function clip(v, min, max) {
  return Math.min(Math.max(v, min), max)
}

module.exports = clip