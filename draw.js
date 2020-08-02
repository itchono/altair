
var canvas
var ctx
var drawingboard

var mouseX
var mouseY

let strokes = [] // List of strokes made by the user.

onmousemove = function(e){mouseX = e.clientX; mouseY = e.clientY}

// wizardy stupid JS code
var mouseDown = 0;
document.body.onmousedown = function() { 
    strokes.push([]) // add new strokes
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

class Point {
    constructor(x,y) {
        this.x = x;
        // NOTE: use percentage value
        this.y = y;
        //this.r = r;
    }
  }

function newCanvas() {

    canvas = document.createElement("canvas")

    drawingboard = document.getElementById("drawingboard")

    canvas.width = drawingboard.clientWidth
    canvas.height = canvas.width
    canvas.style="border:1px solid #222222;"

    ctx = canvas.getContext('2d')

    drawingboard.appendChild(canvas)

    setInterval(draw, 20); // creates a routine to run the draw function
}

function draw() {
    // Called once every 20 ms to update the screen

    canvas.width = 0
    canvas.width = drawingboard.clientWidth
    canvas.height = canvas.width

    rect = canvas.getBoundingClientRect()

    if (mouseDown && inRect(rect, mouseX, mouseY)) {
        strokes[strokes.length-1].push(new Point((mouseX - rect.left)/rect.width, (mouseY - rect.top)/rect.height))

    }

    strokes.forEach(function(points, index, arr) {

        if (points[0]) {
            ctx.beginPath()

            ctx.strokeStyle = "#222222"
            ctx.lineWidth = 1;

            ctx.moveTo(points[0].x*ctx.canvas.width, points[0].y*ctx.canvas.height)

            points.forEach(function(point, index, arr) {
                
                ctx.lineTo(point.x*ctx.canvas.width, point.y*ctx.canvas.height)

                ctx.stroke();
            })


            ctx.closePath()

        }
  
    })
    
}

function inRect(rect, x, y) {
    return (x > rect.left && x < rect.left + rect.width && y > rect.top && y < rect.top + rect.height)
}

function clickbutton() {
    alert("Click!")
}

function exportdrawing() {
    var img = new Image()
    
    img.src = canvas.toDataURL("image/png")

    drawingboard = document.getElementById("drawingboard")

    drawingboard.appendChild(img)
}

function clearcanvas() {
    // Clears the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes = []
}

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };