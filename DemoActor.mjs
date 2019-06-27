'set strict'

/** DemoActor: An example actor */

export class DemoActor {

  constructor(options) {

    var self = this

    if (typeof options ==='undefined') options = {}

    this.position = glMatrix.vec2.create()

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
