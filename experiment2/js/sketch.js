// sketch.js - procedurally generates a scrolling wetlands landscape
// Author: Raven Cruz
// Date: 4-13-2025

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  //redrawCanvas(); // Redraw everything based on new size
}

//* CLASSES *//
// NOISE CLASS
class NoiseSettings{
  /**
   * contains settings for noise generation
   * @param {number} seed     - Set to maintain sequence of noise-generated numbers.
   * @param {number} level    - Sets amount of variation in noise output (higher = more variation).
   * @param {number} scale    - Sets sample range of noise output. Analogous to zooming in/out (higher = "zoom out").
   * @param {object} mod      - (Optional) Sets modifiers for noise output as relevant to structure type (i.e. parallax, etc). 
   * @param {function} place  - (Optional) Function to used to place individual pixels from noise output. 
   */
  constructor(seed, level, scale, mod, place){
    this.seed = seed; 
    this.level = level; 
    this.scale = scale; 

    for(let md in mod){   // add modifiers (i.e. squish, parallax, etc...)
      this[md] = mod[md];
    }

    if(place) this.place = place; 
  }
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

  update() {
    this.x -= SPEED/2;    // move tree along x axis
    let ground = H/2;
    
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

/* exported setup, draw */
// globals
canvasContainer = $("#canvas-container");
let W = canvasContainer.width();
let H = canvasContainer.height();
let COLOR; // defined in setup()
let SPEED = 0.5;

// tree generation stuff
let treeline = [];
let treeSpacing = {min: 3, max: 30};

// hill generation stuff
let hillSeed = 0;
let hills = { // noise settings for hill generation @ different distances
  far:  new NoiseSettings(0, 100, 0.009, { parallax: 10 }),
  mid:  new NoiseSettings(1, 100, 0.007, { parallax: 5 }),
  near: new NoiseSettings(2, 90,  0.007, { parallax: 2.5 }),
}

// sky generation stuff
let skyGFX;
let sky = new NoiseSettings( 
  0, 400, 0.009, {squish: 0.1},
  (gfx, c, x, y, maxY) => {
    let strokeColor = pickSkyColor(c);
    gfx.stroke(strokeColor);

    // reflect at h/2 (midpoint, aka horizon)
    gfx.point(x, maxY*2 - y);   // bottom half
    gfx.point(x, y);            // top half
  }
)

// ground generation stuff
let bufferGFX;
let groundGFX;
let groundScroll = W;
let ground = new NoiseSettings( 
  0, 500, 0.001, {squish: 0.15},
  (gfx, c, x, y, maxY) => {
    let strokeColor = pickGroundColor(c);
    gfx.stroke(strokeColor);

    // draw stroke, starting from mid screen (horizon) 
    // and "upside down" (h - y) so perspective effect compresses toward horizon
    gfx.point(x, maxY/2 + maxY-y);
  }
)

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

  // place our canvas, making it fit our container
  let canvas = createCanvas(W, H);
  canvas.parent("canvas-container");

  // make graphics objects for sky amd ground
  skyGFX = createGraphics(W, H);
  groundGFX = createGraphics(W, H);
  bufferGFX = createGraphics(W, H); // helper for ground refresh

  init();
  
  $("#reimagine").click(() => regenerate());

  /*
  // TODO: fix resizing. currently incompatible with scrolling effect
  // resize canvas if the page is resized
  $(window).resize(function() { resizeScreen(); });
  resizeScreen();
  */
}

function draw() {  
  // put sky as background
  image(skyGFX, 0, 0);  

  // generate hills
  perlinHills(H/4,    COLOR.hillsFar,   hills.far);
  perlinHills(H/3.5,  COLOR.hillsMid,   hills.mid);
  perlinHills(H/3,    COLOR.hillsNear,  hills.near);        // draw closest hills
  perlinHills(H/3,    COLOR.hillsNear,  hills.near, 0.2);   // draw closest hills' reflection

  // update trees
  for(let tree of treeline){ tree.update(); }

  // recycle off-screen trees
  for (let i = treeline.length - 1; i >= 0; i--) {
    if (treeline[i].x < -50) {
      treeline.splice(i, 1);   // bye tree
      treeline.push(new Tree(  // new tree
        W + random(treeSpacing.min, treeSpacing.max), 
        random(COLOR.trees))
      );
    }
  }

  // only update ground when scroll factor is a whole num
  if(groundScroll % 1 === 0){ 
    // copy current ground into a buffer, leaving out the leftmost column,
    // which will shift ground leftward one px when we copy it back to screen
    bufferGFX.copy(groundGFX, 
      1, 0, W, H, 
      0, 0, W, H
    );
    // clear ground (this will preserve transparency on update)
    groundGFX.clear();

    // refill ground with buffer
    groundGFX.copy(bufferGFX, 
      0, 0, W, H, 
      0, 0, W, H
    );
    // clear buffer (again, to preserve transparency)
    bufferGFX.clear();

    // note: there may be a better way to handle this, but i like the outcome
    // as it is. i found that i need the buffer object so that i can clear 
    // ground on update without losing the data and having an empty wetland
    
    drawPerlinColumn(groundGFX, groundScroll, W - 1, H, ground);
  }

  // my incredibly cursed solution to unwanted opacity loss
  image(groundGFX, 0, 0);
  image(groundGFX, 0, 0);
  image(groundGFX, 0, 0);
  // TODO: ^fumigate

  // update ground scroll amt (helps us track perlin values for ground generation)
  groundScroll+=SPEED;
}

function init(){
  // init treeline
  treeline = [];
  for (let x = 0; x < width*20; x += random(treeSpacing.min, treeSpacing.max)) {
    treeline.push(new Tree(x, random(COLOR.trees)));
  }
  
  // init ground, fill canvas w perlin columns
  for (let x = 0; x < width; x++) {
    drawPerlinColumn(groundGFX, x, x, H, ground);
    drawPerlinColumn(skyGFX, x, x, H/2, sky);
  }
}

// 1D perlin function to generate hills
function perlinHills(elevation, color, ns, squishReflect){
  noiseSeed(ns.seed);
  
  if(squishReflect){ color.setAlpha(150); } // low opacity for reflections
  else{ color.setAlpha(255); }

  noStroke();
  fill(color);
  beginShape();
  for (let x = 0; x <= W; x++) {
    // shift hills at rate of speed/parallax; more parallax = slower shift
    let nx = ns.scale * (x + frameCount * SPEED/ns.parallax); 
    let y = ns.level * noise(nx) + elevation;

    if (squishReflect) {
      // adjust y to be upside down and squished, for reflections
      let hillHeight = y - H/2;
      y = H/2 - hillHeight * squishReflect;
    }

    // start shape
    vertex(x, y);
  }
  vertex(W, H/2 + 1); 
  vertex(0, H/2 + 1); // close shape at bottom
  endShape(CLOSE);
}

/**
 * draws one vertical column of perlin noise
 * @param {Graphics} gfx          - p5 Graphics object to draw to
 * @param {int} noiseX            - x-coordinate in perlin space (infinite)
 * @param {int} screenX           - x-coordinate on screen (where to drawn column)
 * @param {int} maxY              - height scaling, total height being drawn to
 * @param {NoiseSettings} ns      - NoiseSettings object with seed, level, scale, squish, and place()
 */
// p5.js noise info: https://p5js.org/reference/p5/noise/
function drawPerlinColumn(gfx, noiseX, screenX, maxY, ns) 
{
  noiseSeed(ns.seed);

  let mod = 1;
  let nx = ns.scale * noiseX;
  for (let y = 0; y < maxY; y++) {
    // modify scale along y-axis, squishing it as y gets larger
    if(ns.squish > -1){ mod = map(y, 0, maxY, 1, ns.squish); }
    let squish = ns.scale / mod; 
    let ny = squish * y;
    let c = ns.level * noise(nx, ny);   // get noise value

    ns.place(gfx, c, screenX, y, maxY); // call place() function
  }
}

// color picker for sky generation
function pickSkyColor(c){
  let strokeColor = COLOR.sky.clear;
  if(c < 185){ strokeColor = COLOR.sky.clearcloud; }
  else if(c < 205){ strokeColor = COLOR.sky.mid; }
  else if(c < 210){ strokeColor = COLOR.sky.cloudclear; }
  else{ strokeColor = COLOR.sky.cloud; }

  return strokeColor;
}

// color picker for ground generation
function pickGroundColor(c){
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
  
  strokeColor.setAlpha(strokeAlpha);   // low opacity for sky reflection!
  return strokeColor;
}

// re-roll new noise vals and re-init generators
function regenerate() {
  noLoop();   // pause draw() on regen

  // clear all canvases
  clear();
  groundGFX.clear();
  bufferGFX.clear();
  skyGFX.clear();
  
  // reset groundScroll (tracking perlin x-values)
  groundScroll = W;

  // random seeds
  ground.seed = random(0, 2556);
  sky.seed = random(0, 2556);
  for(let hill in hills){
    hills[hill].seed = random(0, 2556);
  }

  init();
  loop();   // restart draw()
}
