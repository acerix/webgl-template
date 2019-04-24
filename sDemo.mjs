'set strict'

/** sWebGL Demo Actor */

export class sDemo {

  constructor(options) {

    var self = this

    if (typeof options ==='undefined') options = {}

    this.position = vec2.create()

    this.speed = [0.1]

    this.colour_frequencies = [
      1,
      1,
      1
    ]

  }

  // Reset position to origin
  reset() {
    this.position[0] = this.position[1] = 0
  }

}
