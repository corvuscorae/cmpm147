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

let COLOR;

let groundSeed = 0;
let hillSeed = 0;
let skySeed = 0;

let sky;
let treeline = [];
let treeSpacing = {min: 3, max: 30};

let buffer;
let field;
let fieldScroll = w;

let speed = 0.5;  // not very tunable atm

// setup() function is called once when the program starts
function setup() {
  // pallete generated here: https://mycolor.space/?hex=%236A994E&sub=1 
  COLOR = {
    grass: color("#6a994e"),
    wet_grass: color("#7e7846"),
    water: color("#c7f8ff"),
    sky: {
      clear: color("#00c2ff"),
      clearcloud: color("#4fcefa"),
      mid: color("#65d7f1"),
      cloudclear: color("#fbf6ec"),
      cloud: color("#f6edd9"),
    },
    hillsFar: color("#00947c"),
    hillsMid: color("#0bab67"),
    hillsNear: color("#6fbe43"),
    trees: [color("#47981b"), color("#1a7300"), color("#2c8000")],
  }

  // init near treeline array
  for (let x = 0; x < width*20; x += random(treeSpacing.min, treeSpacing.max)) {
    treeline.push(new Tree(x, random(COLOR.trees)));
  }

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

  // TODO: fix resizing. currently incompatible with scrolling effect
  //$(window).resize(function() {
  //  resizeScreen();
  //});
  //resizeScreen();
}

function draw() {  
  image(sky, 0, 0);

  perlinHills(100, 0.009, 10, hillSeed, h/4, COLOR.hillsFar, false);
  perlinHills(100, 0.007, 5, hillSeed-2, h/3.5, COLOR.hillsMid, false);
  perlinHills(100, 0.007, 2.5, hillSeed-1, h/3, COLOR.hillsNear, false);
  perlinHills(100, 0.007, 2.5, hillSeed-1, h/3, COLOR.hillsNear, true);

  for(let tree of treeline){ tree.show(); }

  // recycle off-screen trees
  for (let i = treeline.length - 1; i >= 0; i--) {
    if (treeline[i].x < -50) {
      treeline.splice(i, 1);   // bye tree
      treeline.push(new Tree(  // new tree
        w + random(treeSpacing.min, treeSpacing.max), 
        random(COLOR.trees))
      );
    }
  }

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

  // my incredibly cursed solution to unwanted opacity loss
  image(field, 0, 0);
  image(field, 0, 0);
  image(field, 0, 0);
  // TODO: ^fumigate

  fieldScroll+=speed;
}

// TODO: make clouds fluffier/more natty
function perlinSky(gfx) {
  let level = 400;
  let scale = 0.009;
  let squishFactor = 0.1;  // lower = higher perspective shift

  noiseSeed(skySeed);
  
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h/2; y++) {  
      let mod = map(y, 0, h/2, 1, squishFactor);
      let squish = scale / mod;
    
      let nx = scale * x;
      let ny = squish * y;
    
      let c = level * noise(nx, ny);   
         
      let strokeColor = COLOR.sky.clear;
      if(c < 185){ strokeColor = COLOR.sky.clearcloud; }
      else if(c < 205){ strokeColor = COLOR.sky.mid; }
      else if(c < 210){ strokeColor = COLOR.sky.cloudclear; }
      else{ strokeColor = COLOR.sky.cloud; }

      gfx.stroke(strokeColor);
      // reflect at h/2 (midpoint, aka horizon)
      gfx.point(x, h - y);  // bottom half
      gfx.point(x, y);      // top half
      //gfx.point(x, h/2 - y);
      //gfx.point(x, h/2 + y);
    }
  }
}

function perlinHills(level, scale, speedMod, seed, elevation, fillColor, reflection) {
  noiseSeed(seed);

  noStroke();
  if(reflection){ fillColor.setAlpha(200); }
  else{ fillColor.setAlpha(255); }
  fill(fillColor);

  beginShape();
  for (let x = 0; x <= w; x++) {
    let nx = scale * (x + frameCount * speed/speedMod);
    let y = level * noise(nx) + elevation;

    if (reflection) {
      let hillHeight = y - h/2;
      let squishFactor = 0.2; 
      y = h/2 - hillHeight * squishFactor;
    }

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
    let strokeAlpha = 255;
    if (c > 180) { // VEGETATION
      if(c > 200){ strokeColor = COLOR.grass; }
      else { strokeColor = COLOR.wet_grass; } 
    } 
    
    else {       // AGUA
      strokeColor = COLOR.water;
      strokeAlpha = 30;   // low opacity for sky reflection!
      //continue;
    }

    // draw stroke, starting from mid screen (horizon) 
    // and "upside down" (h - y) so perspective effect compresses toward horizon
    strokeColor.setAlpha(strokeAlpha);   // low opacity for sky reflection!
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
  perlinField(field);
  perlinSky(sky);
}

// TREE CLASS
class Tree {
  constructor(x, color) {
    this.x = x;
    this.color = color;

    this.baseWidth = random(8, 15);
    this.height = random(10, 20);
    this.tiers = floor(random(2,floor(this.height/5)));
  }

  show() {
    this.x -= speed/2;    // move tree along x axis
    let ground = h/2;
    
    let tw = this.baseWidth;
    let th = this.height;

    // draw trees
    this.color.setAlpha(255); 
    fill(this.color);
    for(let i = 1; i <= this.tiers; i++){
      let mult = (i === 1) ? 0 : 1; // so we can draw our ground level part of the tree (no floaters)
      triangle(
        this.x, ground-th,                                            // mid
        this.x - tw/2, ground - mult * this.height/(this.tiers*i),    // left
        this.x + tw/2, ground - mult * this.height/(this.tiers*i)     // right
      );
    }

    // add reflections
    th *= 0.5;   // squish em
    this.color.setAlpha(100);
    fill(this.color);
    triangle(
      this.x, ground+th,
      this.x - tw/2, ground,
      this.x + tw/2, ground
    );

  }
}
