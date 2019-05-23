'set strict'

/** DemoPlugin: An example plugin */

export class DemoPlugin {

  constructor(options) {

    var self = this

    if (typeof options === 'undefined') options = {}

    console.log('DemoPlugin constructed')

    if (typeof options.message === 'string') {
      alert(options.message)
    }

  }

}
