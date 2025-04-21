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
    let bitVals = (bitmask) ? getBitVals(grid) : null;

    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        //if (grid[i][j] == "_") {
        // get feature (i.e. walls, ground, etc.) represented by current ASCII key
        let feature = world[WORLD_TYPE].ascii[grid[i][j]];
        if(!feature) feature = "empty";     // if random char is input, default to empty
        let trans = `${bitVals[i][j]}`;
        let tile = { }

        if(!trans || trans === '0' || 
            !world[WORLD_TYPE][feature].transition || 
            !world[WORLD_TYPE][feature].transition[trans])
        {
            tile = {
                i: floor(random(world[WORLD_TYPE][feature].cols)),
                j: floor(random(world[WORLD_TYPE][feature].rows)),
            }
        } else {
            tile = {
                i: world[WORLD_TYPE][feature].transition[trans].i,
                j: world[WORLD_TYPE][feature].transition[trans].j,
            }
        }

        placeTile(i, j, tile.i, tile.j);
      }
    }
}

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

function getKeyByValue(object, value) {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value)
                return prop;
        }
    }
}

//*** AUTOTILING ***//
function bitmaskValues(grid, focus, target){
    let result = [];
    // bits associates with directions for bitmap
    let N = 0b0001; // north
    let W = 0b0010; // west
    let E = 0b0100; // east
    let S = 0b1000; // south

    for(let i = 0; i < grid.length; i++){
        result[i] = [];
        for(let j = 0; j < grid[i].length; j++){
            result[i][j] = 0;
            let bit = 0b0000;
            let val = grid[i][j];

            if(val === focus){
                let empty = getKeyByValue(world[WORLD_TYPE].ascii.empty);

                // if target = "all", check for any neighbors to grid val
                if(target === "all"){
                    if(i > 0 && grid[i-1][j] !== empty && grid[i-1][j] !== focus){ 
                        bit += N; 
                        if(grid[i-1][j] === focus) result[i-1][j] += S;
                    }
                    if(j > 0 && grid[i][j-1] !== empty && grid[i][j-1] !== focus){ 
                        bit += W; 
                        if(grid[i][j-1] === focus) result[i][j-1] += E;
                    }  
                    //if(i < numRows-1 && grid[i+1][j] !== empty){ bit += S; }
                    //if(j < numCols-1 && grid[i][j+1] !== empty){ bit += E; }  
                } else {
                    if(i > 0 && grid[i-1][j] === target){ bit += N; }
                    if(j > 0 && grid[i][j-1] === target){ bit += W; }  
                    if(i < numRows-1 && grid[i+1][j] === target){ bit += S; }
                    if(j < numCols-1 && grid[i][j+1] === target){ bit += E; }  
                }
            } 
            result[i][j] = bit;
        }
    }
    return result;
}