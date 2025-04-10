// sketch.js - purpose and description here
// Author: Your Name
// Date:

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// TODO: rename field stuff for readability
// would be sososoo cool to have parallax in the 
//  field noise thingy. idk how tho 
// ALSO need to make this work with resizing
/* exported setup, draw */
let groundSeed = 0;
let hillSeed = 0;
let sky;

let field;
let fieldScroll;
let speed = 1;  // not very tunable atm

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  sky = createGraphics(width, height);
  field = createGraphics(width, height);
  
  fieldScroll = width;
  perlinField(field);
  
  createButton("reimagine").mousePressed(() => regenerate());

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  sky.background("silver");
  image(sky, 0, 0);
  
  // only update field when scroll factor is a whole num
  if(fieldScroll % 1 === 0){ 
    // shift field leftward one px
    field.copy(field, 
      1, 0, width - 1, height, 
      0, 0, width - 1, height
    );
    
    drawPerlinColumn(field, fieldScroll, width - 1);
  }
  
  image(field, 0, 0);
  
  fieldScroll+=speed;

  perlinHills();
}

function perlinHills() {
  let level = 75;
  let scale = 0.01;
  noiseSeed(hillSeed);

  for (let x = 0; x < width; x++) {
    let nx = scale * (x + frameCount*speed/3);
    let c = level * noise(nx);
    stroke("peru");
    
    line(x, height / 2, x, c + height / 4);
  }
  
}

// fill canvas with field values
function perlinField(gfx) {
  for (let x = 0; x < width; x++) {
    drawPerlinColumn(gfx, x, x);
  }
}

// draws one vertical column of perlin noise
//   > noiseX = x-coordinate in perlin space (infinite)
//   > screenX = x-coordinate on screen (where to drawn column)
// based on https://p5js.org/reference/p5/noise/
function drawPerlinColumn(gfx, noiseX, screenX) {
  let level = 450;
  let scale = 0.001;        // lower = larger scale
  let squishFactor = 0.1;  // lower = higher perspective shift
  noiseSeed(groundSeed);

  for (let y = 0; y < height; y++) {
    // modify scale along y-axis, squishing it as y gets larger
    let mod = map(y, 0, height, 1, squishFactor);
    let squish = scale / mod;

    let nx = scale * noiseX;
    let ny = squish * y;

    let c = level * noise(nx, ny);
    
    let strokeColor;
    if(c > 180) { 
      if(c > 200){ strokeColor = "olivedrab" }
      else { strokeColor = "olive"; } 
    }
    else { 
      if(c < 150){ strokeColor = "#ccf5ff"; }
      else { strokeColor = "#b3f0ff"; }
    } 
    gfx.stroke(strokeColor);
    gfx.point(screenX, height/2 + height-y);
    // draw stroke, starting from mid screen (horizon) 
    // and "upside down" (height - y) so perspective effect compresses toward horizon
  }
}


function regenerate() {
  clear();
  field.clear();
  background("silver");
  
  fieldScroll = width;

  // random seeds
  groundSeed = random(0, 2556);
  hillSeed = random(0, 2556);

  // generate
  perlinHills();
  perlinField(field);
}