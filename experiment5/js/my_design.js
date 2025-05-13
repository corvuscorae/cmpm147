/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

//partner coding with Raven Cruz
function getInspirations() {
    return [
      {
        name: "Aurora Jupiter",
        assetUrl: "../../img/jupiter.jpg",
        credit: "Hubble Space Telescope, 2016",
      },
      {
        name: "Mars",
        assetUrl: "../../img/mars.png",
        credit: "NASA/JPL Viking Mars Mosaic", // TODO: get year
      },
      {
        name: "Pluto",
        assetUrl: "../../img/pluto.jpg",
        credit: "NASA New Horizons, July 2015",
      },
      {
        name: "Not moon",
        assetUrl: "../../img/DeathStar.jpg",
        credit: "https://starwars.fandom.com/wiki/DS-2_Death_Star_II_Mobile_Battle_Station" // TODO: find OG credit
      },
      {
        name: "Sagan (dog)",
        assetUrl: "../../img/sagan.jpg",
        credit: "self"
      },
      {
        name: "Raven (v1)",
        assetUrl: "../../img/raven_A.png",
        credit: "self"
      },
      {
        name: "Raven (v2)",
        assetUrl: "../../img/raven_B.png",
        credit: "self"
      }
    ];
  }
  
  let SCALE;
  function initDesign(inspiration) {
    SCALE = 200 / inspiration.image.width;
    resizeCanvas(inspiration.image.width * SCALE, inspiration.image.height * SCALE);
  
    let design = {
      bg: 0,
      fg: [],
    };
    
    for (let i = 0; i < 3000; i++) {
      const x = random(1, width);
      const y = random(1, height);

      const sizeDiv = (i < 100) ? 4 : 10;   // 100 larger shapes, the rest smaller
      const w = random(1, width  / sizeDiv);
      const h = random(1, height / sizeDiv);
      design.fg.push({
        x: x,
        y: y,
        w: w,
        h: h,
        fill: getAvgColor(
          inspiration.image,
          { min: x / SCALE, max: (x + w) / SCALE },
          { min: y / SCALE, max: (y + h) / SCALE }
        ),
      });
    }
    return design;
  }
  
  function getAvgColor(img, xRange, yRange) {
    img.loadPixels();
  
    let avgRed = 0;
    let avgGreen = 0;
    let avgBlue = 0;

    const numY = (yRange.max - yRange.min);
    const numX = (xRange.max - xRange.min);
    let numPixels;
    if(numY === 0 && numX === 0) return { r: 0, g: 0, b: 0 }
    else if(numY === 0 && numX !== 0){ numPixels = numX; }
    else if(numX === 0 && numY !== 0){ numPixels = numY; }
    else{ numPixels = numY * numX; }
    
  
    // Loop through the pixels X and Y
    for (let y = floor(yRange.min); y <= floor(yRange.max); y++) {
      for (let x = floor(xRange.min); x <= floor(xRange.max); x++) {
        // Calculate the pixel index
        const index = (y * img.width + x) * 4;
  
        // Sum the red, green, and blue values
        avgRed += img.pixels[index + 0];
        avgGreen += img.pixels[index + 1];
        avgBlue += img.pixels[index + 2];
      }
    }
  
  
    avgRed /=   floor(numPixels);
    avgGreen /= floor(numPixels);
    avgBlue /=  floor(numPixels);
    
    return {
      r: avgRed,
      g: avgGreen,
      b: avgBlue,
    };
  }
  
  function renderDesign(design, inspiration) {
    background(0);
    noStroke();
    for (let box of design.fg) {
      fill(box.fill.r, box.fill.g, box.fill.b, floor(random(128,255))); // alpha 
      
      // coinflip to decide which shape to draw
      const coin = random();
      if(coin < 0.5){ rect(box.x, box.y, box.w, box.h); }
      else{ ellipse(box.x, box.y, box.w, box.h); }
    }
  }
  
  function mutateDesign(design, inspiration, rate) {
    design.bg = mut(design.bg, 0, 255, rate);
    for (let box of design.fg) {
      
      box.x = mut(box.x, 1, width, rate);
      box.y = mut(box.y, 1, height, rate);
      box.w = mut(box.w, 1, width / 2, rate);
      box.h = mut(box.h, 1, height / 2, rate);
      
      if(frameCount % 20 === 0 ||
        box.fill.r === null || box.fill.g === null || box.fill.b === null
      ){
        box.fill = getAvgColor(
          inspiration.image,
          { min: box.x / SCALE, max: (box.x + box.w) / SCALE },
          { min: box.y / SCALE, max: (box.y + box.h) / SCALE }
        );
      }
      box.fill.r = mut(box.fill.r, box.fill.r, box.fill.r + floor(random(0,rate)), rate);
      box.fill.g = mut(box.fill.g, box.fill.g, box.fill.g + floor(random(0,rate)), rate);
      box.fill.b = mut(box.fill.b, box.fill.b, box.fill.b + floor(random(0,rate)), rate);
    }
  }
  
  function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / random(10,20)), min, max);
  }
  