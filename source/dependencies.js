// This file is a proxy to global dependencies, such as pixi and jsen. This 
// file is not necessary to run the library, but it is pretty useful to handle
// the unit tests.

const pixi = window.PIXI
const jsen = window.jsen

export {pixi, jsen}