// sketch.js - purpose and description here
// Author: Your Name
// Date:

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  //redrawCanvas(); // Redraw everything based on new size
}

// TODO: rename field stuff for readability
// would be sososoo cool to have parallax in the 
//  field noise thingy. idk how tho 
// ALSO need to make this work with resizing
/* exported setup, draw */
canvasContainer = $("#canvas-container");
let w = canvasContainer.width();
let h = canvasContainer.height();

let groundSeed = 0;
let hillSeed = 0;
let skySeed = 0;
let sky;

let buffer;
let field;
let fieldScroll = w;
let speed = 0.5;  // not very tunable atm

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  let canvas = createCanvas(w, h);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  sky = createGraphics(w, h);
  field = createGraphics(w, h);
  buffer = createGraphics(w, h);
  
  perlinField(field);
  perlinSky(sky);
  
  $("#reimagine").click(() => regenerate());

  // TODO: fix resizing w/ scroll
  //$(window).resize(function() {
  //  resizeScreen();
  //});
  //resizeScreen();
}

function draw() {  
  image(sky, 0, 0);
  image(field, 0, 0);
  
  // only update field when scroll factor is a whole num
  if(fieldScroll % 1 === 0){ 
    // shift field leftward one px

    // copy current field into a buffer, leaving out the leftmost column
    buffer.copy(field, 
      1, 0, w, h, 
      0, 0, w, h
    );
    
    // clear field (this will preserve transparency on update)
    field.clear();

    // refill field with buffer
    field.copy(buffer, 
      0, 0, w, h, 
      0, 0, w, h
    );

    // clear buffer (again, to preserve transparency)
    buffer.clear();

    // note: there may be a better way to handle this, but i like the outcome
    // as it is. i found that i need the buffer object so that i can clear 
    // field on update without losing the data and having an empty wetland
    
    drawPerlinColumn(field, fieldScroll, w - 1);
  }

  image(field, 0, 0);
  fieldScroll+=speed;

  perlinHills();

}

// TODO: make clouds fluffier/more natty
function perlinSky(gfx, xMax, yMax) {
  if(!xMax) xMax = w;
  if(!yMax) yMax = h;
  noiseSeed(skySeed);
  
  let vShift = 350;
  for (let y = 0; y < yMax + vShift; y++) {  // shifted up to reflect at horizon
    for (let x = 0; x < xMax; x++) {
      let level = 450;
      let scale = 0.05;
      
      let mod = map(y, 0, w, 10, 1);
      let squish = scale / mod;
    
      let nx = squish * x;
      let ny = squish * y;
    
      let c = level * noise(nx, ny);      

      let strokeColor = "white"
      if(c > 200){ strokeColor = "skyblue"; }
      gfx.stroke(strokeColor);
      gfx.point(x, y);
    }
  }
}

function perlinHills() {
  let level = 75;
  let scale = 0.01;
  noiseSeed(hillSeed);
  
  noStroke();
  fill("peru");
  beginShape();
  for (let x = 0; x <= w; x++) {
    let nx = scale * (x + frameCount * speed/10);
    let y = level * noise(nx) + h/4;
    vertex(x, y);
  }
  vertex(w, h/2 + 1); 
  vertex(0, h/2 + 1); // close shape at bottom
  endShape(CLOSE);
}

// fill canvas with field values
function perlinField(gfx, xMin, xMax) {
  if(!xMin) xMin = 0;
  if(!xMax) xMax = w;

  for (let x = xMin; x < xMax; x++) {
    drawPerlinColumn(gfx, x, x);
  }
}

// draws one vertical column of perlin noise
//   > noiseX = x-coordinate in perlin space (infinite)
//   > screenX = x-coordinate on screen (where to drawn column)
// based on https://p5js.org/reference/p5/noise/
function drawPerlinColumn(gfx, noiseX, screenX) {
  let level = 500;
  let scale = 0.001;        // lower = larger scale
  let squishFactor = 0.15;  // lower = higher perspective shift
  noiseSeed(groundSeed);

  for (let y = 0; y < h; y++) {
    // modify scale along y-axis, squishing it as y gets larger
    let mod = map(y, 0, h, 1, squishFactor);
    let squish = scale / mod;

    let nx = scale * noiseX;
    let ny = squish * y;

    let c = level * noise(nx, ny);

    let strokeColor;
    if (c > 180) { // VEGETATION
      if(c > 200){ strokeColor = "olivedrab" }
      else { strokeColor = "olive"; } 
    } 
    
    else {       // AGUA
      continue;//strokeColor = "skyblue" // TODO: reflect sky here instead
    }

    // draw stroke, starting from mid screen (horizon) 
    // and "upside down" (h - y) so perspective effect compresses toward horizon
    gfx.stroke(strokeColor);
    gfx.point(screenX, h/2 + h-y);
  }
}


function regenerate() {
  clear();
  field.clear();
  buffer.clear();
  sky.clear();
  
  fieldScroll = w;

  // random seeds
  groundSeed = random(0, 2556);
  hillSeed = random(0, 2556);
  skySeed = random(0, 2556);

  // generate
  perlinHills();
  perlinField(field);
  perlinSky(sky);
}