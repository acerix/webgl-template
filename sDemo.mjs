'set strict'

/** sWebGL Demo Actor */

export class sDemo {

  constructor(options) {

    var self = this

    if (typeof options ==='undefined') options = {}

    this.position = vec2.create()

    this.speed = 128

    this.colour = [
      100 - 200 * Math.random(),
      100 - 200 * Math.random(),
      100 - 200 * Math.random()
    ]

  }

  // Reset position to origin
  reset() {
    this.position[0] = this.position[1] = 0
  }

}
