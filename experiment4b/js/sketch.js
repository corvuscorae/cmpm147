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
let [tw, th] = [p3_tileWidth(), p3_tileHeight()];
let clicks = {};
let worldSeed;

let points = [];
let polygons = [];
const jitter = 20;
const relaxation = 1;
let scrollFactor = 5;
let worldScroll = [0, 0];

const water = [
  [120, 176, 141],
  [146, 200, 166],
  [126, 175, 146],
  [75, 128, 106],
  [103, 160, 134],
]

function p3_preload() {}

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("canvas-container");
  
  points = generatePoints();
  polygons = generateVoronoi();
  renderPolygons(polygons);
  renderPoints();
  
  let label = createP();
  label.html("World key: ");
  label.parent("canvas-container");

  let str_input = createInput("xyzzy");
  str_input.parent(label);
  str_input.input(() => {
    rebuildWorld(str_input.value());
  });

  createP("WASD keys scroll. Dragging spins web.").parent("canvas-container");
}

function rebuildWorld(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  //p3_setup(); // TEMP: just proof of concept stuff
  clear();
  points = generatePoints();
  polygons = generateVoronoi();
  renderPolygons(polygons);
  renderPoints();

}

function p3_tileWidth() {
  return 16;
}
function p3_tileHeight() {
  return 16;
}

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function pointsToRegion(numPoints, xRange, yRange){
        let result = [];
    for(let i = 0; i < numPoints; i++){
        let px = random(xRange[0], xRange[1]);
        let py = random(yRange[0], yRange[1]);

        result.push([px, py]);
    }

    return result;
}

function mouseMoved(){
    
}

function mouseDragged(){
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
        let newPoints = pointsToRegion(1, 
            [mouseX - random(50,150), mouseX + random(50,150)], 
            [mouseY - random(50,150), mouseY + random(50,150)]
        ); 
        points = points.concat(newPoints);
        polygons = generateVoronoi();
        renderPolygons(polygons); 
        renderPoints();
    }
}

function draw() {
    if (keyIsPressed === true) {
        if (key === "w") {
            clear();
            updatePoints(points, 0, scrollFactor);

            let newPoints = pointsToRegion(1, 
              [mouseX - random(100,300), mouseX + random(100,300)], 
              [mouseY - random(100,300), mouseX + random(100,300)]); 
            points = points.concat(newPoints);

            worldScroll[1] += scrollFactor;
            polygons = generateVoronoi();
            renderPolygons(polygons); 
            renderPoints();

        } 
        if (key === "s") {
            clear();
            updatePoints(points, 0, -scrollFactor);

            let newPoints = pointsToRegion(1, 
              [mouseX - random(100,300), mouseX + random(100,300)], 
              [mouseY - random(100,300), mouseX + random(100,300)]); 
            points = points.concat(newPoints);

            worldScroll[1] -= scrollFactor;
            polygons = generateVoronoi();
            renderPolygons(polygons); 
            renderPoints();
        } 
        if (key === "a") {
            clear();    
            updatePoints(points, scrollFactor, 0);

            let newPoints = pointsToRegion(1, 
              [mouseX - random(100,300), mouseX + random(100,300)], 
              [mouseY - random(100,300), mouseX + random(100,300)]); 
            points = points.concat(newPoints);

            worldScroll[0] += scrollFactor;
            polygons = generateVoronoi();
            renderPolygons(polygons); 
            renderPoints();
        }    
        if (key === "d") {
            clear();
            updatePoints(points, -scrollFactor, 0);

            let newPoints = pointsToRegion(1, 
              [mouseX - random(100,300), mouseX + random(100,300)], 
              [mouseY - random(100,300), mouseX + random(100,300)]); 
            points = points.concat(newPoints);

            worldScroll[0] -= scrollFactor;
            polygons = generateVoronoi();
            renderPolygons(polygons); 
            renderPoints();
        }
    }  
}

function mouseClicked(){
  clear();
  points.push([mouseX, mouseY]);
  polygons = generateVoronoi();
  renderPolygons(polygons);
  renderPoints();
}

function generatePoints(xOffset = 0, yOffset = 0){
  let result = [];
  
  // https://www.npmjs.com/package/d3-delaunay
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      // jitter points
      // https://www.redblobgames.com/x/1830-jittered-grid/#org6f80f93
      noiseSeed(worldSeed / i);
      let px = abs(floor(i + jitter * tw * (noise(i, j) - 0.5)));
      noiseSeed(worldSeed / j);
      let py = abs(floor(j + jitter * th * (noise(i, j) - 0.5)));

      px = floor(map(px, 0, 20, 0, width)) + xOffset;
      py = floor(map(py, 0, 20, 0, height)) + yOffset;

      result.push([px, py]);
    }
  }
  
  return lloydRelaxation(result, relaxation);
  
}

function updatePoints(points, xOffset = 0, yOffset = 0){
  for(let point of points){
    point[0] += xOffset;
    point[1] += yOffset;
  }
}


function generateVoronoi(){
  const delaunay = window.d3.Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, width, height]);
  const polygons = Array.from(voronoi.cellPolygons());
  //const areas = calculateAreas(polygons);

  //getPolygonColors();
  for(let polygon of polygons){
    //console.log(polygon);
    let color;
    
    for(let pt of polygon){
      if(pt[0] === 0 || pt[1] === 0){
        color = [0,0,0];
      }
    }
    //console.log(color)
    if(!color){ getNoiseColor(window.d3.polygonArea(polygon), water); }
    polygon = {
      poly: polygon,
      color: [0,0,0]//color
    }
  }
  
  
  return polygons;
}

function lloydRelaxation(points, iterations, xRange = [0, width], yRange = [0, height]) {
  const delaunay = window.d3.Delaunay.from(points);
  let voronoi = delaunay.voronoi([xRange[0], yRange[0], xRange[1], yRange[1]]);
  let polygons = Array.from(voronoi.cellPolygons());
  
  for (let i = 0; i < iterations; i++) {
    const newPoints = [];
    for (let j = 0; j < polygons.length; j++) {
      const cellPolygon = polygons[j];
      const centroid = window.d3.polygonCentroid(cellPolygon);
      newPoints.push(centroid);
    }
    points = newPoints;
    voronoi = window.d3.Delaunay.from(points).voronoi([0, 0, width, height]);
    polygons = Array.from(voronoi.cellPolygons());
  }
  return points;
}

function renderPolygons(polygons, areas) {
  const minArea = min(areas);
  const maxArea = max(areas);

  for (let polygon of polygons) {
    // fill color based on the area
    //const area = areas[polygons.indexOf(polygon)];
    // fill blue scale color
    //const color = map(area, minArea, maxArea, 0, 200);
    push()
    //let col = getNoiseColor(polygon[0][0], polygon[0][1], water);
    let col = [0,0,0]//getNoiseColor(window.d3.polygonArea(polygon), water);
    fill(...col);

    // draw the polygon
    //noFill();
    stroke("white")
    beginShape();
    for (let point of polygon) {
      vertex(point[0], point[1]);
    }
    endShape();
    pop()
  }
}


// getNoiseCOlor() adapted from Wes Modes' 
// https://wmodes.github.io/cmpm147/experiment4/index.html 
let colorScale = 0.08;
function getNoiseColor(a, color) {
  // Generate a noise value based on x and y
  let noiseValue = noise(
    a * colorScale,
    a * colorScale,
    //frameCount * colorScale/(5)
  );

  if (noiseValue < 0.45 && noiseValue > 0.4) {
    return [255, 255, 255];
  }

  // Map the noise value to an index in the color array
  let index = floor(map(noiseValue, 0, 1, 0, color.length));

  // Retrieve and return the selected color from the array
  return color[index];
}

function renderDelaunay(delaunay) {
  const { points, triangles } = delaunay;

  for (let i = 0; i < triangles.length; i += 3) {
    // get the points index of the triangle
    const a = 2 * triangles[i + 0];
    const b = 2 * triangles[i + 1];
    const c = 2 * triangles[i + 2];

    // draw the triangle
    triangle(
      points[a],
      points[a + 1],
      points[b],
      points[b + 1],
      points[c],
      points[c + 1]
    );
  }
}

function renderPoints(){
  /*
  for (let [px, py] of points) {
    //console.log(px,py);
    push();
    stroke("orange");
    strokeWeight(5);
    point(px, py);
    pop();
  }
    */
}