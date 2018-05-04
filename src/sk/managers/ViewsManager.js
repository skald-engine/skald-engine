const $ = require('sk/$')
const Manager = require('sk/core/Manager')
const View = require('sk/core/View')

class ViewData {
  constructor(id, view, modal) {
    this.id = id
    this.view = view
    this.modal = modal
  }
}

class ViewsManager extends Manager {
  constructor() {
    super()

    this._views = []
    this._modal = null
    this._modalStack = []

    this._viewAddedSignal = null
    this._viewEnterSignal = null
    this._viewRemovedSignal = null
    this._stage = null
  }

  setup() {
    let injector = $.getInjector()
    this._stage = injector.resolve('stage')
    this._viewAddedSignal = injector.resolve('viewAddedSignal')
    this._viewEnterSignal = injector.resolve('viewEnterSignal')
    this._viewRemovedSignal = injector.resolve('viewRemovedSignal')
  }

  add(viewId, modal=false) {
    let injector = $.getInjector()
    let view = injector.resolve(viewId)

    if (!view.prototype || !(view.prototype instanceof View)) {
      throw new Error(`View "${viewId}" must be an instance of "sk.core.View".`)
    }

    if (this.has(viewId)) {
      throw new Error(`You cannot add the same view twice on views manager.`)
    }

    try {
      view = new view()
    } catch (e) {
      throw new Error(`Could not instantiate the view "${viewId}" due to:`, e)
    }

    view.setup()

    let obj = new ViewData(viewId, view, modal)
    if (modal) {
      this._modalStack.push(obj)

    } else {
      this._views.push(obj)
      this._stage.views.addChild(view)
      view.enter()
      this._viewEnterSignal.dispatch(viewId, view)
    }

    this._viewAddedSignal.dispatch(viewId, view)
    this._checkModal()
  }

  has(viewId) {
    return !!this._views.find(x => x.id === viewId) ||
           !!this._modalStack.find(x => x.id === viewId) ||
           !!(this._modal && this._modal.id === viewId)
  }

  hasModal() {
    return !!this._modalStack.length || !!this._modal
  }

  remove(viewId) {
    let index = this._views.findIndex(x => x.id === viewId)
    let indexModal = this._modalStack.findIndex(x => x.id === viewId)
    let view = null

    if (index >= 0) {
      view = this._views[index]
      view.view.leave()
      this._views.splice(index, 1)
      this._stage.views.removeChild(view.view)
      view.view.destroy()
      
    } else if (this._modal && this._modal.view === view) {
      view = this._modal
      view.view.leave()
      this._modal = null 
      this._stage.modals.removeChild(view.view)
      view.view.destroy()

    } else if (indexModal >= 0) {
      view = this._modalStack[index]
      view.view.leave()
      this._modalStack.splice(index, 1)
      this._stage.modals.removeChild(view.view)
      view.view.destroy()
    }
    
    if (view) {
      this._viewRemovedSignal.dispatch(view.id)
      this._checkModal()
    }
  }

  remoteLastModal() {
    if (this._modal) {
      view = this._modal
      view.view.leave()
      this._modal = null 
      this._stage.modals.removeChild(view.view)
      this._viewRemovedSignal.dispatch(view.id)
      view.view.destroy()
    }

    this._checkModal()
  }

  update() {
    if (this._modal) {
      this._modal.view.update()
    }

    for (let i=0; i<this._modalStack.length; i++) {
      this._modalStack[i].view.update()
    }

    for (let i=0; i<this._views.length; i++) {
      this._views[i].view.update()
    }
  }

  _checkModal() {
    if (!this._modal && this._modalStack.length) {
      this._modal = this._modalStack.shift()
      this._stage.modals.addChild(this._modal.view)
      this._modal.view.enter()
      this._viewEnterSignal.dispatch(viewId, this._modal.view)
    }
  }
}

module.exports = ViewsManager