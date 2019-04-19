'set strict'

/** sWebGL Demo Actor */

export class sDemo {

  constructor(options) {

    var self = this

    if (typeof options ==='undefined') options = {}

    // The actor's position (2d)
    this.position = vec2.create()

    // Example actor params
    this.colour = [
      10 - 20 * Math.random(),
      10 - 20 * Math.random(),
      10 - 20 * Math.random()
    ]

  }

  // Reset position to origin
  reset() {
    this.position[0] = this.position[1] = 0
  }

}
