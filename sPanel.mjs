'set strict'

/** sPanel: Displays controls */

export class sPanel {

  constructor(options) {

    let self = this

    if (typeof options ==='undefined') options = {}

    // <div> container for the panel
    this.div = document.createElement('div')
    this.div.classList.add('panel')

    // <table> for the sliders
    this.slider_table = document.createElement('table')
    this.slider_table.style.display = 'none'
    let tbody = document.createElement('tbody')
    this.slider_table.appendChild(tbody)
    this.div.appendChild(this.slider_table)

    // buttons
    let panel_buttons = document.createElement('p')
    panel_buttons.classList.add('buttons')

    let reset_button = document.createElement('a')
    reset_button.textContent = 'Reset'
    reset_button.href = ''
    panel_buttons.appendChild(reset_button)

    let toggle_panel_button = document.createElement('a')
    toggle_panel_button.textContent = 'Control Panel'
    toggle_panel_button.onclick = function() {
      self.toggle()
    }
    panel_buttons.appendChild(toggle_panel_button)

    this.div.appendChild(panel_buttons)

    document.body.appendChild(this.div)

  }

  toggle() {
    this.slider_table.style.display = this.slider_table.style.display === 'none' ? 'block' : 'none'
  }

  drawSliders(params, name, options) {

    if (typeof name === 'undefined') {
      name = '?'
    }

    for (let i in params) switch (typeof params[i]) {

      case 'number':
        this._drawSlider(params, i, name + '_' + i, options)
        break;

      case 'object':
        this.drawSliders(params[i], name + '_' + i, options)
        break;

      default:
        console.error('Undefined param type:', typeof params[i])
        break;

    }

  }

  _drawSlider(params, i, name, options) {

    if (typeof options === 'undefined') {
      options = {}
    }

    if (typeof options.min === 'undefined') {
      options.min = -2.0
    }
    if (typeof options.max === 'undefined') {
      options.max = 2.0
    }
    if (typeof options.onChange === 'undefined') {
      options.onChange = null
    }

    // Table row
    let tr = document.createElement('tr')

    // Label
    let label_td = document.createElement('td')
    let label = document.createTextNode(name)
    label_td.appendChild(label)
    tr.appendChild(label_td)

    // Input text
    let text_input_td = document.createElement('td')
    text_input_td.classList.add('label')
    let text_input = document.createElement('input')
    text_input.id = name + '_number_input'
    text_input.type = 'number'
    text_input.step = 0.001
    text_input.value = params[i].toFixed(3)
    text_input_td.appendChild(text_input)
    tr.appendChild(text_input_td)

    // Input slider
    let range_input_td = document.createElement('td')
    let range_input = document.createElement('input')
    range_input.id = name + '_range_input'
    range_input.type = 'range'
    range_input.min = options.min
    range_input.max = options.max
    range_input.step = 0.01
    range_input.value = params[i]
    range_input_td.appendChild(range_input)
    tr.appendChild(range_input_td)

    // Callbacks when inputs change
    text_input.onchange = function(event) {
      params[i] = +event.target.value
      range_input.value = params[i]
      if (typeof options.onChange === 'function') {
        options.onChange(name)
      }
    }
    range_input.oninput = range_input.onChange = function(event) {
      params[i] = +event.target.value
      text_input.value = params[i].toFixed(3)
      if (typeof options.onChange === 'function') {
        options.onChange(name)
      }
    }

    // Add row to slider table
    this.slider_table.appendChild(tr)

  }

}
