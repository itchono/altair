
var canvas
var drawingboard

// wizardy stupid JS code
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

let points = []

function newCanvas() {

    canvas = document.createElement("canvas")

    drawingboard = document.getElementById("drawingboard")

    canvas.width = drawingboard.clientWidth
    canvas.height = canvas.width

    drawingboard.appendChild(canvas)

    setInterval(draw, 20); // creates a routine to run the draw function
}

function draw() {
    canvas.width = 0
    canvas.width = drawingboard.clientWidth
    canvas.height = canvas.width
    
}

function clickbutton() {
    alert("Click!")
}