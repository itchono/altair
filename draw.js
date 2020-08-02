/*
Drawing module
*/

// Components
var canvas
var ctx
var drawingboard

// Drawing Metrics
var canvasLeft
var canvasTop
var colour = "#222222"
var weight = 2

let strokes = [] // List of strokes made by the user.

class Point {
    constructor(x,y) {
        this.x = x;
        // NOTE: use percentage value
        this.y = y;
        //this.r = r;
    }
  }

class Stroke {
    constructor(strokecolour, strokeweight) {
        this.points = []
        this.colour = strokecolour
        this.weight = strokeweight
    }
}

/*
EVENT TRIGGERS
*/

var mouseDown = 0

onmousemove = function(e){ 
    if (mouseDown) {
        strokes[strokes.length-1].points.push(new Point((e.clientX - canvasLeft)/canvas.width, (e.clientY - canvasTop)/canvas.height)) 
    }
}

onresize = function() {
    canvas.width = 0
    canvas.width = drawingboard.clientWidth - 2
    canvas.height = canvas.width

    rect = canvas.getBoundingClientRect()
    canvasLeft = rect.left
    canvasTop = rect.top
    
    draw()
}

reframe = function() {
    rect = canvas.getBoundingClientRect()
    canvasLeft = rect.left
    canvasTop = rect.top
}

redraw = function() {ctx.clearRect(0, 0, canvas.width, canvas.height);draw();}

onscroll = reframe

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
      undo()
    }
  });

function changecolour(input) { colour = input.value }

function changeweight(input) { weight = input.value }


function newCanvas() {

    canvas = document.createElement("canvas")

    drawingboard = document.getElementById("drawingboard")

    canvas.width = drawingboard.clientWidth - 2
    canvas.height = canvas.width

    canvas.style="border:1px solid #222222;touch-action: none;"

    ctx = canvas.getContext('2d')

    drawingboard.appendChild(canvas)

    
    // CANVAS ATTRIBUTES
    canvas.onmousedown = function(e) { 
        mouseDown = 1
        strokes.push(new Stroke(colour.repeat(1), weight)) // add new strokes 
        strokes[strokes.length-1].points.push(new Point((e.clientX - canvasLeft)/canvas.width, (e.clientY - canvasTop)/canvas.height))
    }
    canvas.onmouseup = function() {
        mouseDown = 0
        cleanstrokes() // check for empty lists
        redraw()
    }

    canvas.ontouchstart = function(e) {
        strokes.push(new Stroke(colour.repeat(1), weight)) // add new strokes 
        strokes[strokes.length-1].points.push(new Point((e.touches[0].clientX - canvasLeft)/canvas.width, (e.touches[0].clientY - canvasTop)/canvas.height)) 
    }

    canvas.ontouchend = function(){cleanstrokes(); redraw()}

    canvas.ontouchmove = function(e) { strokes[strokes.length-1].points.push(new Point((e.touches[0].clientX - canvasLeft)/canvas.width, (e.touches[0].clientY - canvasTop)/canvas.height)) }

    setInterval(draw, 20); // creates a routine to run the draw function

    reframe()
}

function cleanstrokes() {
    // deletes empty strokes if last stroke was empty, sort of defunct
    if (!strokes[strokes.length-1].points.length) {
        strokes.pop() // remove old strokes
    }
}

function draw() {
    // Called once every 20 ms to update the screen
    strokes.forEach(function(stroke, index, arr) {
        points = stroke.points

        switch(stroke.points.length) {
            case 0: break;

            case 1:
                ctx.beginPath()
                ctx.arc(points[0].x*canvas.width, points[0].y*canvas.height, stroke.weight, 0, 2 * Math.PI)
                ctx.fillStyle = stroke.colour
                ctx.fill()

            default:
                ctx.beginPath()

                ctx.strokeStyle = stroke.colour
                ctx.lineWidth = stroke.weight;
                ctx.lineCap = 'round'
    
                ctx.moveTo(points[0].x*ctx.canvas.width, points[0].y*ctx.canvas.height)
    
                points.forEach(function(point, index, arr) {
                    ctx.lineTo(point.x*ctx.canvas.width, point.y*ctx.canvas.height)
                    
                })

                ctx.stroke();

                break;
        }
    })
}

function inRect(rect, x, y) {
    return (x > rect.left && x < rect.left + rect.width && y > rect.top && y < rect.top + rect.height)
}



function clearcanvas() {
    // Clears the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes = []
}

function undo() {
    // Undoes a step
    strokes.pop()
    redraw()
}

function exportdrawing() {
    exportbox = document.getElementById("exportbox")

    text = document.createElement("p")
    text.innerHTML = "Image: " + Date()

    img = new Image()
    img.src = canvas.toDataURL("image/png")

    exportbox.appendChild(text)
    exportbox.appendChild(img)

    

}

function exportdrawingdownload() {
    // Downloads the image
    link = document.createElement("a")
    link.href = img.src
    link.setAttribute("download", "Comrade Drawing")
    link.click()
}

function exportdrawingcopy() {
    copyToClipboard(canvas.toDataURL("image/jpeg", 0.1)) // 0.5 compression on jpg
    copybutton = document.getElementById("copybutton")
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