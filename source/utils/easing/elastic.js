const PI2 = Math.pi*2

/**
 * Creates an elastic easing function with a given amplitude and a period.
 *
 * @param {Number} amplitude
 * @param {Number} period
 * @return {Function} The easing functions.
 */
export function getElasticIn(amplitude, period) {
  return function(x) {
    if (x===0 || x===1) return x
    var s = period/PI2*Math.asin(1/amplitude)
    return -(amplitude*Math.pow(2, 10*(x-=1))*Math.sin((x-s)*PI2/period))
  }
}

/**
 * Creates an elastic easing function with a given amplitude and a period.
 *
 * @param {Number} amplitude
 * @param {Number} period
 * @return {Function} The easing functions.
 */
export function getElasticOut(amplitude, period) {
  return function(x) {
    if (x===0 || x===1) return x
    var s = period/PI2 * Math.asin(1/amplitude)
    return (amplitude*Math.pow(2, -10*x)*Math.sin((x-s)*PI2/period)+1)
  }
}

/**
 * Creates an elastic easing function with a given amplitude and a period.
 *
 * @param {Number} amplitude
 * @param {Number} period
 * @return {Function} The easing functions.
 */
export function getElasticInOut(amplitude, period) {
  return function(x) {
    var s = period/PI2 * Math.asin(1/amplitude);
    if ((x*=2)<1) return -0.5*(amplitude*Math.pow(2, 10*(x-=1))*Math.sin( (x-s)*PI2/period ))
    return amplitude*Math.pow(2, -10*(x-=1))*Math.sin((x-s)*PI2/period)*0.5+1
  }
}


/**
 * Elastic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let elasticIn = getElasticOut(1, 0.3)

/**
 * Elastic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let elasticOut = getElasticOut(1, 0.3)

/**
 * Elastic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let elasticInOut = getElasticOut(1, 0.3*1.5)