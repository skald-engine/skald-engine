describe('sk/utils/functions/createClass.js', () => {
  let createClass = require('./createClass.js').default

  it('should create a class correctly', () => {

    class Parent { atParent() {} }

    let atClass = sinon.spy()
    let atProto = sinon.spy()
    let Sub = createClass(Parent, {atClass}, {atProto})

    assert.equal(Sub.atClass, atClass)
    assert.equal(Sub.prototype.atProto, atProto)
    assert.equal(Sub.prototype.atParent, Parent.prototype.atParent)
  })
})