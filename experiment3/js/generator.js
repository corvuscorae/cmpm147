/* exported generateGrid, drawGrid */
/* global placeTile */
function generateGrid(numCols, numRows) {
    console.log("generating...")
    let grid = [];  // empty
 
    if(WORLD_TYPE === "dungeon"){
        grid = new BSP(numCols, numRows).get();
    }
    else {  // WORLD_TYPE === "overworld"
        grid = new PerlinWorld(numCols, numRows).get();
    }
    return grid;
}

// draw tiles based on ASCII values
function drawGrid(grid, bitmask) {
    let bitVals = (bitmask) ? bitmaskValues(grid) : null;

    // make a layer for every symbol we find in world[WORLD_TYPE].ascii
    let myWorld = world[WORLD_TYPE];
    for(let type in myWorld.ascii){
        myWorld.gfx[type] = createGraphics(width, height);
    }

    // loop through whole grid, placing tiles only on their respective layers
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        // get feature (i.e. walls, ground, etc.) represented by current ASCII key
        let feature = myWorld.ascii[grid[i][j]];
        if(!feature) feature = "empty";     // if random char is input, default to empty

        let trans =`${bitVals[i][j]}`;
        let tile = { }
        let transTile = { }
        let gfx = myWorld.gfx[grid[i][j]];
        
        // place tiles
        tile = {
            i: floor(random(myWorld[feature].cols)),
            j: floor(random(myWorld[feature].rows)),
        }
        placeTile(gfx, i, j, tile.i, tile.j);

        // TODO: LEFT OFF HERE
        //      > IMPROVE BITMASKING
        //      > add idle water anims
        //          >> for user interactions, have animation change in someway on hover
        //      > figure out how to have user interaction in dungeon (minesweeper?)
        //      > fix persistent gfx (make them erase every reseed or whatever)
        //      > clean up code
        //      > fix grid lines
        //      > add decor (biomes w/ floodfill would be cool if time allows)
        //      > make reseed actully random
        //      > add text box for custom seeding
        //      > add tilebased topdown clouds (credit jackie for inspo)
        
        // check for transitions
        //if(trans && myWorld[feature].transition &&        // there's a transition here,
        //    myWorld[feature].transition[trans])            //  add a transition tile to gfx buffer 
        //{
        //    transTile = {
        //        i: myWorld[feature].transition[trans].i,
        //        j: myWorld[feature].transition[trans].j,
        //    }
        //} else { transTile = false; } 

        
        if(trans && myWorld[feature].transition && TRANS_DIR[trans]){ 
            for(let d of TRANS_DIR[trans]){
                let dir = DIR[d];
                if(!dir) continue;

                let di =  i + dir.dx;
                let dj = j + dir.dy;

                if(di < 0 || di > grid.length || dj < 0 || dj > grid[0].length) continue;
                transTile = {
                    i: myWorld[feature].transition[d].i,
                    j: myWorld[feature].transition[d].j,
                }
                
                rectMode(CORNER);

                /* DEBUG */
                //placeTile(gfx, i, j, 0, 18); // DEBUG: puts a yellow square over tile w/ transitions
                //gfx.text(trans, floor(TILE_SIZE * j), floor(TILE_SIZE * i)+TILE_SIZE);
                placeTile(gfx, di, dj, transTile.i /*+ (d === "W") ? 1:0*/, transTile.j); 
            }
        }
      }
    }
}


/*
function getBitVals(grid){
    let focusVal = world[WORLD_TYPE].bitmasking.focus[0];
    let focus = getKeyByValue(world[WORLD_TYPE].ascii, focusVal);

    let targetVal = world[WORLD_TYPE].bitmasking.target[0];
    let target;
    if(targetVal === "all"){ target = targetVal; }
    else { target = getKeyByValue(world[WORLD_TYPE].ascii, targetVal); }

    // if i add more focus/target pairs...
    // ...add a for loop here to cycle thru all of em
    
    return bitmaskValues(grid, focus, target);
}
*/

function getKeyByValue(object, value) {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value)
                return prop;
        }
    }
}

//*** AUTOTILING ***//
// adapted from a past perlin project, *TODO: INSERT PROJECT URL AND REFERENCE URL*
// instead of searching for any neighbor, search for self neighbors (since each symbol is drawn to its own layer)
function bitmaskValues(pVals){
    let result = [];
    // bits associates with directions for bitmap
    let N = 0b0001; // north
    let W = 0b0010; // west
    let E = 0b0100; // east
    let S = 0b1000; // south

    for(let i = 0; i < pVals.length; i++){
        result[i] = [];
        for(let j = 0; j < pVals[0].length; j++){
            let bit = 0b0000;
            let pVal = pVals[i][j];

            if(pVal){
                // TODO: dis out of whack. put it in whack and fix the weird DIR offsetting that resulted from its whackness
                if(i > 0 && pVals[i-1][j] === pVals[i][j]){ // if current tile has a NORTH neighbor...
                    // ...add it to current tile's bitmap value
                    bit += N;      
                }
                if(j > 0 && pVals[i][j-1] === pVals[i][j]){ // if current tile has a WEST neighbor...
                    // ...add it to current tile's bitmap value
                    bit += W;  
                }  
                if(i < pVals.length-1 && pVals[i+1][j] === pVals[i][j]){ 
                    bit += S;      
                }
                if(j < pVals[0].length-1 && pVals[i][j+1] === pVals[i][j]){ 
                    bit += E;  
                }  
            }          

            result[i][j] = bit;
        }
    }

    return result;
}