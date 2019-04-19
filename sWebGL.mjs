'set strict'

/* WebGL utilities */

export class sWebGL {

  constructor(options) {

    var self = this

    if (typeof options ==='undefined') options = {}

    // Plugins
    this.plugins = options.hasOwnProperty('plugins') ? options.plugins : {}

    // Animation stops when not awake
    this.awake = true
    window.onfocus = function() {self.awake = true}
    window.onblur = function() {self.awake = false}

    // Function called for each frame
    this.drawScene = function() {}

    // Create canvas DOM element
    this.canvas = document.createElement('canvas')
    document.body.appendChild(this.canvas)

    // Init canvas
    this.gl = this.canvas.getContext('webgl', {
      alpha: false,
      preserveDrawingBuffer: true
    })

    // Uniforms
    this.scale_location = null
    this.tranform_location = null
    this.resolution_location = null
    this.color_location = null

    // Handle viewport resize
    window.onresize = function() {
      self.canvas.width = window.innerWidth
      self.canvas.height = window.innerHeight
      self.canvas.centre = [
        Math.floor(self.canvas.width/2),
        Math.floor(self.canvas.height/2)
      ]
      self.gl.viewport(0, 0, self.canvas.width, self.canvas.height)
      self.gl.uniform2f(self.resolution_location, self.canvas.width, self.canvas.height)
    }

    // Trigger resize on init
    this.init()
    window.onresize()

    // Init plugins
    if (typeof this.plugins === 'object') {
      for (var i in this.plugins) if (typeof this.plugins[i].init === 'function') {
        this.plugins[i].init(this)
      }
    }

    this.life(this)

  }

  // Begin or restart rendering
  init() {
    //var gl = this.gl
    //gl.clearColor(0.0, 0.0, 0.0, 1.0)  // Clear to black, fully opaque
    //gl.clearDepth(1.0)                 // Clear everything
    //gl.enable(this.gl.DEPTH_TEST)      // Enable depth testing
    //gl.depthFunc(this.gl.LEQUAL)       // Near things obscure far things
    this.initShaders()
  }

  // Load shaders
  initShaders() {
    var gl = this.gl
    var shaderProgram = gl.createProgram()

    gl.attachShader(shaderProgram, this.getShader('shader-vs'))
    gl.attachShader(shaderProgram, this.getShader('shader-fs'))
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(shaderProgram))
    }

    gl.useProgram(shaderProgram)

    // Look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(shaderProgram, 'a_position')

    // Scale
    this.scale_location = gl.getUniformLocation(shaderProgram, 'u_scale')

    // Scroll position
    this.transform_location = gl.getUniformLocation(shaderProgram, 'u_transform')

    // Screen resolution
    this.resolution_location = gl.getUniformLocation(shaderProgram, 'u_resolution')

    // Colour
    this.color_location = gl.getUniformLocation(shaderProgram, 'u_color')

    // Create a buffer
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(positionLocation)

    // Send the vertex data to the shader program
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Set initial colour to green
    gl.uniform4f(this.color_location, 0, 1, 0, 1)

  }

  // Looping callback
  life(self) {

    // Pass sWebGL instance in the callback
    var callback = function() {
      self.life(self)
    }

    // Sleep in background
    if (!self.awake) return window.setTimeout(callback, 512)

    // Draw
    this.drawScene()

    // Loop after vsync
    window.requestAnimationFrame(callback)
  }

  // Load shader from <script>
  getShader(id) {
    var gl = this.gl
    var scriptElement = document.getElementById(id)
    if (scriptElement === null) {
      throw new Error('Shader script element "' + id + '" not found')
    }
    var shader = gl.createShader(gl[scriptElement.type.replace('text/x-','').toUpperCase()])
    gl.shaderSource(shader, scriptElement.textContent)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader))
    }
    return shader
  }

  // Draw a pixel on the canvas
  drawPixel(position) {
    var gl = this.gl
    gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
    gl.drawArrays(gl.POINTS, 0, 1)
  }

  // Draw pixels on the canvas
  drawPixels(position_buffer) {
    var gl = this.gl
    gl.bufferData(gl.ARRAY_BUFFER, position_buffer, gl.STATIC_DRAW)
    gl.drawArrays(gl.POINTS, 0, position_buffer.length)
  }

  // Return the height of the screen or width if smaller
  smallestScreenEdge() {
    return Math.min(this.canvas.height, this.canvas.width)
  }

  // Convert x from screen basis to gl basis
  xFromScreenBasis(x, z) {
    return x / z * this.smallestScreenEdge() - this.canvas.centre[0]
  }

  // Convert y from screen basis to gl basis
  yFromScreenBasis(y, z) {
    return y / z * this.smallestScreenEdge() - this.canvas.centre[1]
  }

  // Convert x to screen basis from gl basis
  xToScreenBasis(x, z) {
    //return x + this.canvas.centre[0]
    return (x + this.canvas.centre[0]) / this.smallestScreenEdge() * z
  }

  // Convert y to screen basis from gl basis
  yToScreenBasis(y, z) {
    //return y + this.canvas.centre[1]
    return (y + this.canvas.centre[1]) / this.smallestScreenEdge() * z
  }

}
