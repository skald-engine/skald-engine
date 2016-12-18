var memberList = []

exports.onHandleTag = function(ev) {
  for (let tag of ev.data.tag) {
    if (tag.kind === 'get' || tag.kind === 'set') {
      let key = tag.memberof + '.' +tag.name

      // ignore if get or set was already processed
      if (memberList.indexOf(key) >= 0) {
        ev.data.tag.splice(ev.data.tag.indexOf(tag), 1)
      }

      else {
        tag.kind = 'member'
        memberList.push(key)
      }
    }
  }
};