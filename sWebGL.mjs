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
      depth: false,
      preserveDrawingBuffer: true
    })

    // Uniforms
    this.scale_location = null
    this.tranform_location = null
    this.speed_location = null
    this.resolution_location = null
    this.color_params_location = null

    // Handle viewport resize
    window.onresize = function() {
      self.canvas.width = window.innerWidth
      self.canvas.height = window.innerHeight
      self.canvas.centre = [
        Math.floor(self.canvas.width/2),
        Math.floor(self.canvas.height/2)
      ]
      self.gl.viewport(0, 0, self.canvas.width, self.canvas.height)
      self.gl.uniform1f(self.resolution_location, self.smallestScreenEdge())
      self.gl.clear(self.gl.COLOR_BUFFER_BIT)
    }

    // Initialize WebGL
    this.init()

    // Trigger resize after init
    window.onresize()

    // Init plugins
    if (typeof this.plugins === 'object') {
      for (var i in this.plugins) if (typeof this.plugins[i].init === 'function') {
        this.plugins[i].init(this)
      }
    }

    // Start main loop
    this.life(this)

  }

  // Begin or restart rendering
  init() {
    var gl = this.gl
    //gl.clearColor(0.0, 0.0, 0.0, 1.0)
    //gl.clearDepth(1.0)
    //gl.enable(gl.DEPTH_TEST)
    //gl.depthFunc(gl.LEQUAL)
    this.initShaders()
  }

  // Load shaders
  initShaders() {
    var gl = this.gl

    var shader_program = gl.createProgram()

    // Attach shaders
    gl.attachShader(shader_program, this.getShader('shader-vs'))
    gl.attachShader(shader_program, this.getShader('shader-fs'))

    gl.linkProgram(shader_program)

    if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(shader_program))
    }

    gl.useProgram(shader_program)

    // Position of vertex data
    var position_location = gl.getAttribLocation(shader_program, 'a_position')

    // Screen resolution
    this.resolution_location = gl.getUniformLocation(shader_program, 'u_resolution')

    // Scale
    this.scale_location = gl.getUniformLocation(shader_program, 'u_scale')

    // Position
    this.transform_location = gl.getUniformLocation(shader_program, 'u_transform')

    // Speed
    this.speed_location = gl.getUniformLocation(shader_program, 'u_speed')

    // Default speed
    gl.uniform1f(this.speed_location, Math.random())

    console.log(this.speed_location)

    // Time
    this.time_location = gl.getUniformLocation(shader_program, 'u_time')

    // Colour Params
    this.color_params_location = gl.getUniformLocation(shader_program, 'u_color_params')

    // Default to something non-zero
    gl.uniform3f(this.color_params_location, 1, 1, 1)

    // Position vertices
    var vertices = new Float32Array([
       1,  1,  0,
      -1,  1,  0,
       1, -1,  0,
      -1, -1,  0
    ])

    // Bind position buffer
    var vertex_buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(position_location, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, null) // unbind
    gl.enableVertexAttribArray(position_location)

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
