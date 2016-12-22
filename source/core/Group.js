import Entity from 'core/Entity'
import {tryToInstantiate} from 'utils'


/**
 * 
 */
export default class Group extends Entity {
  constructor(game, scene) {
    let displayObject = new PIXI.Container()
    super(game, scene, displayObject)
  }

  initialize() {}

  add(entity, amount=1) {}
  addAt(entity, index, amount=1) {}

  remove(entity) {}
  removeAt(index) {}
  removeBetween(initialIndex, finalIndex) {}
  removeAll() {}

  getAll(tag) {}
  getAt(index) {}
  getBetween(initialIndex, finalIndex) {}
  getAlive(tag)
  getDead(tag)

  countAlive() {}
  countDied() {}

  filter(fn, thisValue) {}
  find(fn, thisValue) {}
  findIndex(fn, thisValue) {}
  forEach(fn, thisValue) {}
  forEachAlive(fn, thisValue) {}
  forEachDead(fn, thisValue) {}
  map(fn, thisValue) {}
  sort(fn) {}
  reverse() {}

  swap() {}

  update(delta) {}
  destroy() {}
  isGroup() {}
}