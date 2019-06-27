'set strict'

/** sKeys Plugin: Handles keyboard input */

export class sKeys {

  constructor(options) {

    let self = this

    if (typeof options ==='undefined') options = {}

    // Button states, 0 or 1 when down
    this.b = Array.from(Array(256), () => 0)

    // Callbacks for each key when pressed
    this.onDown = options.hasOwnProperty('onDown') ? options.onDown : []

    // Callbacks for each key when released
    this.onUp = options.hasOwnProperty('onUp') ? options.onUp : []

    // Callbacks for each key called each frame while pressed
    this.whileDown = options.hasOwnProperty('whileDown') ? options.whileDown : []

    // Handle key down
    window.onkeydown = function(e) {
      let k = (e?e:event).which
      self.b[k] = 1
      if (typeof self.onDown[k] === 'function') {
        self.onDown[k]()
      }
      //console.log('KeyDown:',k)
    }

    // Handle key up
    window.onkeyup = function(e) {
      let k = (e?e:event).which
      self.b[k] = 0
      if (typeof self.onUp[k] === 'function') {
        self.onUp[k]()
      }
    }

  }

}
