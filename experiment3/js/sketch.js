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
let canvasContainer = $("#canvas-container");
let tileCanvas;
let bgLayer;
let splitVis;
const asciiBox = document.getElementById("asciiBox");
var centerHorz, centerVert;

let tilesetImage;
const TILE_SIZE = 16;   // size of tiles in tileset, in px

function resizeScreen() {
  console.log("Resizing...");

  // get actual w, h
  let rawW = canvasContainer.width();
  let rawH = canvasContainer.height();

  // snap to nearest multiple of TILE_SIZE
  let boxW = rawW - (rawW % TILE_SIZE);
  let boxH = rawH - (rawH % TILE_SIZE);

  centerHorz = boxW / 2; // Adjusted for drawing logic
  centerVert = boxH / 2; // Adjusted for drawing logic

  // resize ascii box 
  asciiBox.style.width =  `${boxW}px`;
  asciiBox.style.height = `${boxH}px`;

  // update grid dims
  asciiBox.rows = boxH / TILE_SIZE;
  asciiBox.cols = boxW  / TILE_SIZE;

  numRows = asciiBox.rows;
  numCols = asciiBox.cols;

  resizeCanvas(boxW, boxH);
  // redrawCanvas(); // Redraw everything based on new size
}

/* exported preload, setup, draw, placeTile */
/* global generateGrid drawGrid */
function preload() {
  tilesetImage = loadImage('./assets/tileset.png');
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  asciiGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  tileCanvas = createCanvas(TILE_SIZE * numCols, TILE_SIZE * numRows).parent("canvas-container");

  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  $(window).resize(function() {
    resizeScreen();
    regenerateGrid();

    bgLayer = createGraphics(width, height);
    bgLayer.noSmooth(); // Keep that pixel aesthetic
    backgroundVoid();
  });
  
  resizeScreen();
  reseed();

  bgLayer = createGraphics(width, height);
  bgLayer.noSmooth(); // Keep that pixel aesthetic
  backgroundVoid();
}


function draw() {
  randomSeed(seed);
  image(bgLayer, 0, 0);
  drawGrid(asciiGrid, true);

  if(splitVis && splitVis.width > 0 && splitVis.height > 0) {
    image(splitVis, 0, 0); // debug/demo to show BSP splits
  }
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 
    floor(TILE_SIZE * j), floor(TILE_SIZE * i), 
    TILE_SIZE, TILE_SIZE, 
    floor(TILE_SIZE/2 * ti), floor(TILE_SIZE/2 * tj), 
    TILE_SIZE/2, TILE_SIZE/2
  );
}

function backgroundVoid(){
  bgLayer.clear();
  for(let i = 0; i < numRows; i++){
    for(let j = 0; j < numCols; j++){
      let tile = {
        i: random(world[WORLD_TYPE].empty.cols),
        j: random(world[WORLD_TYPE].empty.rows),
       }

       bgLayer.image(tilesetImage, 
        floor(TILE_SIZE * j), floor(TILE_SIZE * i), 
        TILE_SIZE, TILE_SIZE, 
        floor(TILE_SIZE/2 * tile.i), floor(TILE_SIZE/2 * tile.j), 
        TILE_SIZE/2, TILE_SIZE/2
      );
    }
  }
}

