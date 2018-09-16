'set strict'

// @todo needs a massive cleanup

// @todo get rid of globals
var ctx
var canvas
var gl, program
var colorLocation
var squareVerticesColorBuffer
var gl_translate = [0, 0]
var gl_scale = [1, 1]
var gl_rotate = 0
var shaderProgram, positionAttr, timeUniform, mxUniform, myUniform, vertices, positionBuffer, numVertices
var translateUniform, scaleUniform, rotateUniform
var rUniform, gUniform, bUniform
var focused = true
var pot = 0

// random values
var rand_r = Math.random() / 8;
var rand_g = Math.random() / 8;
var rand_b = Math.random() / 8;
var rand_t = Math.random() / 64;


// Draw a frame
function drawScene() {
  pot++

  gl.uniform1f(timeUniform, Math.sin(pot * rand_t) / 2 + 1)

  gl.uniform1f(rUniform, Math.sin(pot * rand_r))
  gl.uniform1f(gUniform, Math.sin(pot * rand_g))
  gl.uniform1f(bUniform, Math.sin(pot * rand_b))

  gl.uniform2f(translateUniform, gl_translate[0], gl_translate[1])
  gl.uniform2f(scaleUniform, gl_scale[0], gl_scale[1])
  gl.uniform1f(rotateUniform, 2 * Math.PI * gl_rotate)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVertices)
  //var e while (e = gl.getError()) console.log('GL error', e)
}

// Begin rendering
function init() {
  gl.viewportWidth = canvas.width
  gl.viewportHeight = canvas.height
  //gl.clearColor(0.0, 0.0, 0.0, 1.0)  // Clear to black, fully opaque
  //gl.clearDepth(1.0)                 // Clear everything
  //gl.enable(gl.DEPTH_TEST)           // Enable depth testing
  gl.depthFunc(gl.LEQUAL)            // Near things obscure far things
  initShaders()
}

// Looping callback
function life() {
  if (!focused) return window.setTimeout(life, 99)
  drawScene()
  window.requestAnimationFrame(life)
}

// Keep track of browser focus so we can sleep in the background
window.onfocus = function() {focused = true}
window.onblur = function() {focused = false}

// Handle viewport resize
window.onresize = function() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.centre = [Math.floor(canvas.width/2), Math.floor(canvas.height/2)]
  gl_translate = [-canvas.centre[0], -canvas.centre[1]]
  init()
}

// Load shader from <script>
function getShader(gl, id) {
  var scriptElement = document.getElementById(id)
  var shader = gl.createShader(gl[scriptElement.type.replace('text/x-','').toUpperCase()])
  gl.shaderSource(shader, scriptElement.textContent)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader))
  }
  return shader
}

// Load shaders
function initShaders() {
  shaderProgram = gl.createProgram()

  gl.attachShader(shaderProgram, getShader(gl, 'shader-vs'))
  gl.attachShader(shaderProgram, getShader(gl, 'shader-fs'))
  gl.linkProgram(shaderProgram)
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(shaderProgram))
  }

  gl.useProgram(shaderProgram)
  positionAttr = gl.getAttribLocation(shaderProgram, 'a_position')
  gl.enableVertexAttribArray(positionAttr)

  timeUniform = gl.getUniformLocation(shaderProgram, 'u_time')
  translateUniform = gl.getUniformLocation(shaderProgram, 'translate')
  scaleUniform = gl.getUniformLocation(shaderProgram, 'scale')
  rotateUniform = gl.getUniformLocation(shaderProgram, 'rotate')

  rUniform = gl.getUniformLocation(shaderProgram, 'r')
  gUniform = gl.getUniformLocation(shaderProgram, 'g')
  bUniform = gl.getUniformLocation(shaderProgram, 'b')

  vertices = [
    +1, +1, 0,
    -1, +1, 0,
    +1, -1, 0,
    -1, -1, 0
  ]

  positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  numVertices = vertices.length / 3

  //gl.clearColor(0.3, 0.3, 0.3, 1.0)
  //gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, gl.drawingBufferWidth || canvas.width,
                    gl.drawingBufferHeight || canvas.height)

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0)

}



// Init
export function sWebGL(options) {

  // Create canvas DOM element
  canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  var gl_settings = {alpha: false, preserveDrawingBuffer: true}

  gl = canvas.getContext('webgl', gl_settings)

  canvas.centre = [Math.floor(canvas.width/2), Math.floor(canvas.height/2)]

  gl_translate = [-canvas.centre[0], -canvas.centre[1]]
  gl_scale = [1/128, 1/128]
  gl_rotate = -1/8

  init()
  life()
}
