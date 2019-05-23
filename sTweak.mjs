'set strict'

/** sTweak: Tweaks */

export class sTweak {

  constructor(options) {

    var self = this

    if (typeof options === 'undefined') options = {}

    if (typeof options.periodic === 'object') {
      for (var i in options.periodic) {
        setInterval(options.periodic[i].call, options.periodic[i].every * 1000)
      }
    }

  }

}
