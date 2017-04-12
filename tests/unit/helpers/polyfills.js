
// Performance and performance.now
{
  if (typeof global.performance === 'undefined') {
    global.performance = {}
  }

  if (typeof global.performance.now === 'undefined') {
    global.performance.now = () => new Date().getTime()
  }
}