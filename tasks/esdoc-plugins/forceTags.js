exports.onHandleTag = function(ev) {
  let ASTNodeContainer = require(process.cwd() + "/node_modules/esdoc/out/src/Util/ASTNodeContainer.js")

  for (let tag of ev.data.tag) {
    if (!tag.unknown) continue

    let isFunction = tag.unknown.find(x => x.tagName.toLowerCase()==='@function')
    let node = ASTNodeContainer.getNode(tag.__docId__)

    if (isFunction) {
      tag.kind = 'function'
      node.type = 'FunctionDeclaration'
      node.kind = 'function'
    }
  }
}