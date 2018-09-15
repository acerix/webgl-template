/* WebGL helper functions */
// @todo clean the fuck outta this shit and get rid of globals
// <script> // geany code colouring

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

// canvas context
var ctx

// canvas element
var canvas

// point in time
var pot = 0

// constants
const TAU = 2 * Math.PI
const PHI = ( 1 + Math.sqrt(5) ) / 2

const rotate_increment = TAU / Math.pow(PHI,2)

// reinitialize art at point '0'
function reinit() {
  pot = 0
  init()
}

var debug = {
  self: null
  ,print: function (s) {
    document.getElementById('debug').innerHTML += s+'\n'
  }
  ,clear: function () {
    document.getElementById('debug').innerHTML = ''
  }
}

// Keep track of browser focus so we can sleep in the background
var focused = true
window.onfocus = function() {focused = true}
window.onblur = function() {focused = false}

// Handle viewport resize
window.onresize = function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.centre = [Math.floor(canvas.width/2), Math.floor(canvas.height/2)]
    reinit()
}

window.vsync = (function(){ return window.requestAnimationFrame
||  window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame
||  function(callback,element){window.setTimeout(callback,16.66)}
})()

// convert int(0-255) to hex colour code
function chex(i) {
    var h=i.toString(16)
    switch(h.length){
    case 2: return h
    case 1: return '0'+h
  }
  return i > 255 ? 'ff' : '00'
}

function lottery(p) {return Math.floor(Math.random()*p) == p-1}

function randi(i) {return Math.floor(Math.random()*(i+1))}

function rand(r_min, r_max) {
  if (arguments.length == 1) {
    r_max = r_min
    r_min = 0
  }
  if (r_min === undefined) r_max = 0
  if (r_max === undefined) r_max = 2147483647
  return Math.floor(Math.random() * (r_max - r_min + 1)) + r_min
}



var gl, program
var colorLocation
var squareVerticesColorBuffer


var gl_translate = [0, 0]
var gl_scale = [1, 1]

window.onload = function() {

  canvas = document.createElement('canvas')
  canvas.id = 'canvas'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  document.body.appendChild(canvas)

  var gl_settings = {alpha: false, preserveDrawingBuffer: true}

  gl = canvas.getContext('webgl', gl_settings)
    || canvas.getContext('experimental-webgl', gl_settings)

  canvas.centre = [Math.floor(canvas.width/2), Math.floor(canvas.height/2)]

  gl_translate = [-canvas.centre[0], -canvas.centre[1]]

  /*
  gl_scale = [4/canvas.centre[0], 4/canvas.centre[1]]

  if (gl_scale[0]<gl_scale[1]) gl_scale[0] = gl_scale[1]
  else if (gl_scale[0]>gl_scale[1]) gl_scale[1] = gl_scale[0]
  */

  gl_scale = [1/128, 1/128]
  //gl_scale = [1024, 1024]

  init()
  life()
}

function drawScene() {
  pot += 0.04
  //gl.uniform1f(timeUniform, Math.sin(pot / 64))
  gl.uniform1f(timeUniform, pot)
  gl.uniform2f(translateUniform, gl_translate[0], gl_translate[1])
  gl.uniform2f(scaleUniform, gl_scale[0], gl_scale[1])
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVertices)
  //var e while (e = gl.getError()) console.log('GL error', e)
}

function init() {
  gl.viewportWidth = canvas.width
  gl.viewportHeight = canvas.height
  //gl.clearColor(0.0, 0.0, 0.0, 1.0)  // Clear to black, fully opaque
  //gl.clearDepth(1.0)                 // Clear everything
  //gl.enable(gl.DEPTH_TEST)           // Enable depth testing
  gl.depthFunc(gl.LEQUAL)            // Near things obscure far things
  initShaders()
}

function life() {
  if (!focused) return window.setTimeout(life, 999)
  drawScene()
  vsync(life)
}

var canvas, gl
var shaderProgram, positionAttr, timeUniform, mxUniform, myUniform, vertices, positionBuffer, numVertices

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
