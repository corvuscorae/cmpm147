// sketch.js - procedurally generates a scrolling wetlands landscape
// Author: Raven Cruz
// Date: 4-13-2025

// canvas globals
canvasContainer = $("#canvas-container");
let W = canvasContainer.width();
let H = canvasContainer.height();

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
let COLOR; // defined in setup()
let SPEED = 0.5;

// tree generation stuff
let treeline = [];
let treeSpacing = {min: 3, max: 30};

// hill generation stuff
let hillSeed = 0;
let hills = { // noise settings for hill generation @ different distances
  far:  new NoiseSettings(Math.floor(Math.random() * 2556), 100, 0.009, { parallax: 10 }),
  mid:  new NoiseSettings(Math.floor(Math.random() * 2556), 100, 0.007, { parallax: 5 }),
  near: new NoiseSettings(Math.floor(Math.random() * 2556), 90,  0.007, { parallax: 2.5 }),
}

// sky generation stuff
let skyGFX;
let sky = new NoiseSettings( 
  Math.floor(Math.random() * 2556), 400, 0.009, {squish: 0.1},
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
  Math.floor(Math.random() * 2556), 500, 0.001, {squish: 0.15},
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
  colorMode(RGB);
  // pallete generated here: https://mycolor.space/?hex=%236A994E&sub=1 
  COLOR = {
    ground:{
      green_grass: color("#4c7b32"),
      greener_grass: color("#5f8f46"),
      greenest_grass: color("#74a458"),
      dry_grass: color("#afa871"),
      muddy_grass: color("#97905c"),
      mud: color("#7e7846"),
      dark_water: color("#47caca"),
      water: color("#65e5e5"),
      light_water: color("#83ffff"),
    },
    sky: {
      clear: color("#00c2ff"),
      clearish: color("#4fcefa"),
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

  // TODO: fix resizing. currently incompatible with scrolling effect
  // resize canvas if the page is resized
  $(window).resize(function() { resizeScreen(); });
  resizeScreen();
}

function draw() {  
  //if(frameCount % 10 === 1){ console.log(W, H); }
  // put sky as background
  image(skyGFX, 0, 0);  

  // generate hills
  perlinHills(H/4,    COLOR.hillsFar,   hills.far);
  perlinHills(H/3.5,  COLOR.hillsMid,   hills.mid);
  perlinHills(H/3,    COLOR.hillsNear,  hills.near);        // draw closest hills
  perlinHills(H/3,    COLOR.hillsNear,  hills.near, 0.2);   // draw closest hills' reflection

  // recycle off-screen trees
  for (let i = treeline.length - 1; i >= 0; i--) {
    if (treeline[i].x < -treeline[i].baseWidth) { // as soon as tree is offscreen, yeet it
      let tree = treeline.splice(i, 1)[0];                    // yeet
      tree.x = W + random(treeSpacing.min, treeSpacing.max);  // regen
      tree.color = random(COLOR.trees);                       // set new color
      treeline.push(tree);                                    // add it to treeline
    }
  }

  // update trees
  for(let tree of treeline){ tree.update(); }

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
    let y = ns.level * noise(nx) + elevation + 0;

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
  let strokeColor;

  // clouds
  if(c > 260){ strokeColor = COLOR.sky.cloud; }

  else if(c > 245){ strokeColor = COLOR.sky.cloudclear; }
  else if(c > 240 && c < 245){ strokeColor = COLOR.sky.cloud; }
  
  else if(c > 230){ strokeColor = COLOR.sky.cloud; }
  else if(c > 225 && c < 230){ strokeColor = random([COLOR.sky.cloudclear, COLOR.sky.cloud]); }
  
  else if(c > 215){ strokeColor = COLOR.sky.cloudclear; }
  else if(c > 210 && c < 215){ strokeColor = COLOR.sky.cloud; }

  else if(c > 200){ strokeColor = random([COLOR.sky.cloudclear, COLOR.sky.cloud]); }
  else if(c > 195 && c < 200){ strokeColor = COLOR.sky.cloud; }

  else if(c > 185){ strokeColor = COLOR.sky.cloudclear; }
  else if(c > 180 && c < 185){ strokeColor = COLOR.sky.cloud; }

  else if(c > 170){ strokeColor = COLOR.sky.cloudclear; }

  // sky
  else if(c > 160){ strokeColor = COLOR.sky.mid; }
  else if(c > 155){ strokeColor = COLOR.sky.clearish; }
  else{ strokeColor = COLOR.sky.clear; }

  return strokeColor;
}

// color picker for ground generation
function pickGroundColor(c){
  let strokeColor;
  let strokeAlpha = 255;
  if (c > 180) { // VEGETATION
    //if(c > random([220, 230, 240, 250])){ strokeColor = COLOR.ground.bushes; }
    if(c > 250){ strokeColor = COLOR.ground.greener_grass; }
    else if(c > 220){ strokeColor = COLOR.ground.greenest_grass; }
    else if(c > 210){ strokeColor = COLOR.ground.greener_grass; }
    else if(c > 200){ strokeColor = COLOR.ground.green_grass; }
    else if(c > 190){ strokeColor = COLOR.ground.muddy_grass; }
    else { strokeColor = COLOR.ground.mud; } 

    // detailing
    // grassy area
    // texture in center of large-c patches
    let range = {
      min: random(300,350),
      max: random(300,350),
    }
    if(c > range.min && c < range.max){ strokeColor = random([COLOR.ground.greenest_grass, COLOR.ground.green_grass]); }
    if(c > 300 && c < 302){ strokeColor = COLOR.ground.green_grass; }     // borders
    if(c > 350 && c < 352){ strokeColor = COLOR.ground.greenest_grass; }

    // borders
    if(c > 250 && c < 252){ strokeColor = COLOR.ground.green_grass; }
    if(c > 220 && c < 222){ strokeColor = COLOR.ground.green_grass; }

    // texture in mid-c patches
    range = {
      min: random(210,220),
      max: random(210,220),
    }
    if(c > range.min && c < range.max){ strokeColor = random([COLOR.ground.greenest_grass, COLOR.ground.greener_grass]); }
    if(c > 210 && c < 212){ strokeColor = COLOR.ground.greenest_grass; }    // borders
    if(c > 200 && c < 202){ strokeColor = COLOR.ground.greener_grass; }

    // muddy area
    // texture between mud and grass
    range = {
      min: random(190,200),
      max: random(190,200),
    }
    if(c > range.min && c < range.max){ strokeColor = COLOR.ground.dry_grass; }
    if(c > 190 && c < 192){ strokeColor = COLOR.ground.dry_grass; }
    if(c > 180 && c < 182){ strokeColor = COLOR.ground.dry_grass; }
    
  } 
  
  else { // AGUA
    if(c > 170){ 
      strokeColor = COLOR.ground.dark_water; 
      strokeAlpha = 75;   // low opacity for sky reflection!
    }
    else if(c > 160){ 
      strokeColor = COLOR.ground.water; 
      strokeAlpha = 50;   // low opacity for sky reflection!
    }
    else{ 
      strokeColor = COLOR.ground.light_water; 
      strokeAlpha = 25;   // low opacity for sky reflection!
    }
  }
  
  strokeColor.setAlpha(strokeAlpha);   // low opacity for sky reflection!
  return strokeColor;
}

function init(startX = 0){
  console.log("init...")
  // init treeline
  for (let x = startX; x < W; x += random(treeSpacing.min, treeSpacing.max)) {
    treeline.push(new Tree(x, random(COLOR.trees)));
  }
  
  // init ground, fill canvas w perlin columns
  for (let x = 0; x < W; x++) {
    drawPerlinColumn(groundGFX, x, x, H, ground);
    drawPerlinColumn(skyGFX, x, x, H/2, sky);
  }
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

  // rest treeline
  treeline = [];

  init();
  loop();   // restart draw()
}

// RESIZE
// TODO: fix bugs
//        - slow reload
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");

  let oldW = W;
  H = canvasContainer.height();

  if(canvasContainer.width() > W){
    W = canvasContainer.width();

    // remove and re-init graphics
    skyGFX.remove();
    skyGFX = createGraphics(W, H);

    groundGFX.remove();
    groundGFX = createGraphics(W, H);

    bufferGFX.remove();
    bufferGFX = createGraphics(W, H);

    groundScroll = W;

    init(oldW);

    image(skyGFX, 0, 0);
  }

  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  //redrawCanvas(); // Redraw everything based on new size
}