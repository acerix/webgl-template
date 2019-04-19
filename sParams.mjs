'set strict'

/** sParams Plugin: Handles URL parameters */

export class sParams {

  constructor(options) {

    var self = this

    if (typeof options ==='undefined') options = {}

    // Parameter values
    this.params = {}

    // Callbacks for each param when changed
    this.onchange = options.hasOwnProperty('onchange') ? options.onchange : {}

    // Parse when URL hash changes
    window.onhashchange = function() {
      self.parse(true)
    }

  }

  // Called with param object
  init(params) {

    // Reference main params
    this.params = params

    // Update URL hash on init
    this.update()
  }

  // Update the URL hash with the parameters
  update() {
    window.location.hash = '#' + this._serialize(this.params)
  }

  // Parse parameters from the URL hash
  parse(runCallbacks) {
    var new_params = this._unserialize( window.location.hash.substr(1) )
    for (var i in new_params) {

      // Only allow numbers, convert to int if whole otherwise float
      this.params[i] = new_params[i] % 1 === 0 ? parseInt(new_params[i], 10) : parseFloat(new_params[i])

      if (runCallbacks && i in this.onchange) {
        this.onchange[i](this.params[i])
      }
    }
  }

  // Serialize params into a string
  // jquery-param (c) 2015 KNOWLEDGECODE | MIT
  _serialize(a) {
    var s = []
    var add = function (k, v) {
      v = typeof v === 'function' ? v() : v
      v = v === null ? '' : v === undefined ? '' : v
      s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v)
    }
    var buildParams = function (prefix, obj) {
      var i, len, key
      if (prefix) {
        if (Array.isArray(obj)) {
          for (i = 0, len = obj.length; i < len; i++) {
            buildParams(
              prefix + '[' + (typeof obj[i] === 'object' && obj[i] ? i : '') + ']',
              obj[i]
            )
          }
        } else if (String(obj) === '[object Object]') {
          for (key in obj) {
            buildParams(prefix + '[' + key + ']', obj[key])
          }
        } else {
          add(prefix, obj)
        }
      } else if (Array.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
          add(obj[i].name, obj[i].value)
        }
      } else {
        for (key in obj) {
          buildParams(key, obj[key])
        }
      }
      return s
    }
    return buildParams('', a).join('&')
  }

  // Unserialize params from a string
  // based on https://stackoverflow.com/a/26849194
  _unserialize(s) {
    return s.split('&').reduce(function (params, param) {
      var paramSplit = param.split('=').map(function (value) {
        return decodeURIComponent(value.replace(/\\+/g, ' '))
      })
      params[paramSplit[0]] = paramSplit[1]
      return params
    }, {})
  }

}

