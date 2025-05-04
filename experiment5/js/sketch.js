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
/*
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}
*/
/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, initDesign, renderDesign, mutateDesign */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;

  // TODO: LEFT OFF HERE
  // add copies of images to indexed directory 
  //    (...instead of linking to glitch?? how tf does that work)
let autoMutate = false;
let startLow = true;            // init evoltion at low mutations
let mutationCount = 0;
let triesSinceBest = 0;
let initCount = 0;

let toggle;

function preload() {
  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = (e) => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () => inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  initCount = 0;
  slider.value = 1;

  startLow = true;            // init evoltion at low mutations
  mutationCount = 0;
  triesSinceBest = 0;
  initCount = 0;

  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}

function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  
  toggle = document.getElementById("toggle");  
  autoMutate = toggle.checked;
  toggle.onclick = () => {
    autoMutate = toggle.checked;
    inspirationChanged(currentInspiration);
  }
  
  document.getElementById("inspo-img").src =
    currentInspiration.image.canvas.toDataURL();

  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0, 0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;

  // TODO: LEFT OFF HERE
  // make sure box fits around best
  // const bestBox = document.getElementById("best");
}

//fitness function
function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;

  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1 / (1 + error / n);
}

//all the "tope scored images"
function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let avgScore = 0;

//draws current design with a random seed
function draw() {
  //document.getElementById("inspiration").createElement("img");

  if (!currentDesign) {
    return;
  }

  if(autoMutate === true){
    initCount++;
    if(startLow === true){
      slider.value = initCount / 2;
    }
    if(initCount >= 100){
      startLow = false;
    }

    if (triesSinceBest > 100) {
      if(avgScore < 0.075 && random() > 0.5) { 
        slider.value -= floor(random(-1,1)) 
      }
      else slider.value -= floor(random(2));
      triesSinceBest = 0;
      avgScore = 0;
    }
  }

  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value / 100.0);

  //randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
    triesSinceBest = 0;
    avgScore = 0;
  } else {
    triesSinceBest++;
    avgScore += nextScore;
  }

  fpsCounter.innerHTML = Math.round(frameRate());
}
