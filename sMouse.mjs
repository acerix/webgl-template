'set strict'

/** sMouse Plugin: Handles mouse input  */

export class sMouse {

  constructor(options) {

    var self = this

    // Cursor position [x, y], distance from top left in pixels
    this.p = [0, 0]

    // Button states [l, m, r], 0 or 1 when pressed
    this.b = [0, 0, 0]

    // Callbacks for each key when pressed
    this.onDown = options.hasOwnProperty('onDown') ? options.onDown : []

    // Callbacks for each key when released
    this.onUp = options.hasOwnProperty('onUp') ? options.onUp : []

    // Callbacks for each key called each frame while pressed
    this.whileDown = options.hasOwnProperty('whileDown') ? options.whileDown : []

    // Callback on scroll (wheel/touch)
    this.onWheel = options.hasOwnProperty('onWheel') ? options.onWheel : null

    // Handle mouse move
    window.onmousemove = function(e) {
      if (typeof e.originalTarget.offsetLeft === 'number') {
        self.p[0] = e.clientX - e.originalTarget.offsetLeft
        self.p[1] = e.clientY - e.originalTarget.offsetTop
      }
      else {
        self.p[0] = e.clientX
        self.p[1] = e.clientY
      }
      console.log(self.p)
    }

    // Handle mouse button press/release
    window.onmousedown = function(e) {
      self.b[e.button] = 1
      if (typeof self.onDown[e.button] === 'function') {
        self.onDown[e.button]()
      }
    }
    window.onmouseup = function(e) {
      self.b[e.button] = 0
      if (typeof self.onUp[e.button] === 'function') {
        self.onUp[e.button]()
      }
    }

    // Handle mouse wheel
    if (this.onWheel !== null) {
      window.onwheel = function(e) {
        self.onWheel(e.deltaY)
      }
    }

    // Disable context menu on right-click
    document.oncontextmenu = function() {return false}

  }

}
