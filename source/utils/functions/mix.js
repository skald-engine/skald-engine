
/**
 * Helper function to create mixins.
 *
 * Example:
 *
 *     let Mixed = skald.utils.mix(PIXI.Sprite).with(sk.Entity)
 *     
 *     class CustomSprite extends Mixed {
 *     }
 *
 * Reference:
 *
 * - http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 */
export default function mix(superclass) {
  return new Mixin(superclass)
} 





/**
 * @ignore
 */
class Mixin {
  constructor(superclass) {
    this.superclass = superclass
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass)
  }
}