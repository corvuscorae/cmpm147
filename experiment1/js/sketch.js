// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let exampleScroll = "War! The Republic is crumbling under attacks by the ruthless Sith Lord, Count Dooku. There are heroes on both sides. Evil is everywhere. \n\nIn a stunning move, the fiendish droid leader, General Grievous, has swept into the Republic capital and kidnapped Chancellor Palpatine, leader of the Galactic Senate. \n\nAs the Separatist Droid Army attempts to flee the besieged capital with their valuable hostage, two Jedi Knights lead a desperate mission to rescue the captive Chancellor...."
let scroll = getScroll();

const DIV_ID = "canvas-container"  // where to put text (see ../index.html)



class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

var y, z = 0, crawlFont;
function preload() {
  crawlFont = loadFont('assets/NimbusSanLBol.otf');
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $(`#${DIV_ID}`);
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent(DIV_ID);
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  y = height/2;

  
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    // Star Wars opening crawl by CodeFish via p5js.org! See the original here:
    //  https://editor.p5js.org/Codefish/sketches/fABwyG9Jz
    background(0);
    push();
    textFont(crawlFont);
    translate(0, y, z);
    rotateX(PI/4);
    textAlign(CENTER, TOP);
    textSize(width/12);
    fill(255, 200, 0);
    //text("Episode III\nREVENGE OF THE SITH",0,0);
    textSize(width/20);
    var w = width*0.8;
    text(scroll, -w/2, width/4, w,height*20);
    pop();
    y -= height/800;
    z -= height/800;
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function getScroll() {
  let scroll = new OpeningScroller();
  return scroll.generate();

  // global box 
  //$(DIV_ID).text(generate);
}

// global clicker 
//$("#clicker").click(main);

