module.exports = {
  ResizeSignal                : require('sk/signals/display/ResizeSignal'),
  EnterFullscreenSignal       : require('sk/signals/display/EnterFullscreenSignal'),
  LeaveFullscreenSignal       : require('sk/signals/display/LeaveFullscreenSignal'),
  EnterWrongOrientationSignal : require('sk/signals/display/EnterWrongOrientationSignal'),
  LeaveWrongOrientationSignal : require('sk/signals/display/LeaveWrongOrientationSignal'),
  FullscreenChangeSignal      : require('sk/signals/display/FullscreenChangeSignal'),
  OrientationChangeSignal     : require('sk/signals/display/OrientationChangeSignal'),

  ViewAddedSignal   : require('sk/signals/views/ViewAddedSignal'),
  ViewEnterSignal   : require('sk/signals/views/ViewEnterSignal'),
  ViewRemovedSignal : require('sk/signals/views/ViewRemovedSignal'),

  UpdateSignal : require('sk/signals/UpdateSignal'),
}