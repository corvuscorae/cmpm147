"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/


const TILE_SIZE = 16;
const OUT_SIZE = 64;
const tileset_lookup = {
  metadata: {
    types: ["shells", "starfish", "wood", "plants"],
    cols: 14,
    rows: 14,
    dim: 16
  },
  tiles: {
    shells: [
      0, 1, 2, 3, 4, 5, 14, 15, 16, 17, 18, 19, 28, 29, 30, 31, 32, 33, 42, 43,
      44, 45, 46, 47, 56, 57, 58, 59, 60, 61, 70, 71, 72, 73, 74, 75, 84, 85,
      86, 87, 98, 99, 100, 101, 112, 113, 114, 115, 126, 127, 128, 129, 140,
      141, 142, 143, 154, 155, 156, 157,
    ],
    starfish: [
      88, 89, 102, 103, 116, 117, 130, 131, 144, 145, 158, 159, 6, 7, 20, 21,
      34, 35, 48, 49,
    ],
    wood: [
      62, 63, 76, 77, 90, 91, 104, 105, 118, 119, 132, 133, 146, 147, 160, 161,
      8, 9, 22, 23, 36, 37, 50, 51, 64, 65, 78, 79, 92, 93, 106, 107, 120, 121,
      134, 135, 148, 149, 162, 163,
    ],
    plants: [
      10, 11, 12, 13, 26, 27, 24, 25, 38, 39, 40, 41, 52, 53, 66, 67, 80, 81,
      94, 95, 108, 109, 122, 123, 136, 137, 150, 151, 164, 165,
    ],
  },
};

let water = [];
let highlights = [];
const palette = { 
  water: [
    [
      [120, 176, 141],
      [146, 200, 166],
      [126, 175, 146],
      [75, 128, 106],
      [103, 160, 134],
    ],
    [
      [102, 153, 204],
      [0, 102, 153],
      [51, 153, 204],
      [0, 76, 102],
      [102, 204, 255],
    ],
    [
      [70, 130, 180],
      [25, 25, 112],
      [65, 105, 225],
      [0, 0, 139],
      [30, 144, 255],
    ]
  ],
  highlights: [
    [
      [200, 239, 185],
      [195, 232, 180],
      [195, 234, 203],
      [240, 255, 233],
      [204, 247, 212],
    ],
    [
      [204, 255, 255],
      [153, 255, 255],
      [102, 255, 255],
      [255, 255, 255],
      [204, 255, 229],
    ],
    [
      [173, 216, 230],
      [135, 206, 250],
      [176, 224, 230],
      [224, 255, 255],
      [240, 255, 255],
    ]
    
  ]
}

let tilesetImage;
function p3_preload() {
  tilesetImage = loadImage(
    "./assets/spritesheet.png"
  );
}

function p3_setup() {
  console.log(Object.keys(tileset_lookup.tiles));
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);

  // PALETTE PICKING
  let wp =  XXH.h32(key, 0) % palette.water.length;
  let hp =  XXH.h32(key, 0) % palette.highlights.length;
  water = palette.water[wp]
  highlights = palette.highlights[hp]
}

function p3_tileWidth() {
  return 6;
}
function p3_tileHeight() {
  return 4;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

// getNoiseColor() adapted from Wes Modes' 
// https://wmodes.github.io/cmpm147/experiment4/index.html 
let colorScale = 0.08;
function getNoiseColor(i, j, color) {
  // Generate a noise value based on x and y
  let noiseValue = noise(
    i * colorScale,
    j * colorScale,
    frameCount * colorScale/(5)
  );

  if (noiseValue < 0.45 && noiseValue > 0.4) {
    return [255, 255, 255];
  }

  // Map the noise value to an index in the color array
  let index = floor(map(noiseValue, 0, 1, 0, color.length));

  // Retrieve and return the selected color from the array
  return color[index];
}

function getItem(key) {
  //let noiseValue = noise(i, j);
  console.log("noiseValue");
}

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}


function placeTile(i, j, ti, tj) {
  // choose an item type to place
  let nV = noise(ti, tj);
  let type_index = floor(map(nV, 0, 1, 0, tileset_lookup.metadata.types.length));
  let type = tileset_lookup.metadata.types[type_index];
  
  // choose which item to place
  nV = noise(ti / 2, tj / 2);
  let index = floor(map(nV, 0, 1, 0, tileset_lookup.tiles[type].length));
  let tile = tileset_lookup.tiles[type][index];
  let tileImage = {  // converting 1-dimension index to 2d
    i: floor(tile / tileset_lookup.metadata.cols),
    j: tile % tileset_lookup.metadata.rows,
  }

  // match background slant
  rotate(p3_tileHeight() / p3_tileWidth() / 2);
  //scale(1.5, (1.5 * p3_tileHeight()) / p3_tileWidth());

  imageMode(CENTER);
  let tilesize = tileset_lookup.metadata.dim;
  image(tilesetImage,
    i, OUT_SIZE*0.25,
    OUT_SIZE, OUT_SIZE,
    floor(tilesize * tileImage.i),
    floor(tilesize * tileImage.j),
    tilesize, tilesize
  );
}

function p3_drawBefore() {
  background([145, 199, 162]);
  noSmooth();
}

function p3_drawTile(i, j) {
  noStroke();
  if (XXH.h32("tile:" + [i, j], worldSeed) % 8 == 0) {
    let high = getNoiseColor(i, j, highlights);
    fill(...high, 100);
  } else {
    let blue = getNoiseColor(i, j, water);
    fill(...blue, 100);
  }

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    placeTile(0, 0, i, j);
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  pop();
}

function p3_drawSelectedTile(i, j, a) {
  //noFill();
  ///stroke(0, 255, 0, 128);
  noStroke();
  fill(255,255,255, a)
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
}

// give mouse a t(r)ail. consulted with a robot about this (ChatGPT)
let trail = []; // stores mouse positions
let maxTrailLength = 10; // max number of trail points
let lastPos = null;
function p3_drawAfter() {
  // Add new point with full opacity
  trail.push({ x: mouseX, y: mouseY, alpha: 255 });

  // Update and draw each point
  for (let i = 0; i < trail.length; i++) {
    let pos = trail[i];

    // Draw with current alpha
    push();
    translate(pos.x, pos.y);
    p3_drawSelectedTile(pos.alpha);
    pop();

    // Fade it out
    pos.alpha -= 50; // control how fast it fades
  }

  // Remove fully transparent ones
  trail = trail.filter(p => p.alpha > 0);
}
