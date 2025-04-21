/* exported generateGrid, drawGrid */
/* global placeTile */
let bitVals;

function generateGrid(numCols, numRows, type) {
    let grid = [];  // empty
 
    worldType = type;
    let BSP_settings = {
        MIN_LEAF_SZ: 6,
        MAX_DEPTH: 4,
        RM_PADDING: 1,  // leave room for walls
        MIN_RM_SZ: 6,
        debug: {
            partitions: false
        }
    }
    BSP(grid, numCols, numRows, BSP_settings);

    return grid;
}

function getTransTile(t){
    //if(t === 0){ return  `${t}`; }
    if(t === 1){ return  `${t}`; }
    if(t === 2){ return  `${t}`; }
    if(t === 3){ return  `${t}`; }
    if(t === 4){ return  `${t}`; }
    if(t === 5){ return  `${t}`; }
    if(t === 6){ return  `${t}`; }
    if(t === 7){ return  `${t}`; }
    if(t === 8){ return  `${t}`; }
    if(t === 9){ return  `${t}`; }
    if(t === 10){ return `${t}`; }
    if(t === 11){ return `${t}`; }
    if(t === 12){ return `${t}`; }
    if(t === 13){ return `${t}`; }
    if(t === 14){ return `${t}`; }
    if(t === 15){ return `${t}`; }
    return false;
}

// draw tiles based on ASCII values
function drawGrid(grid) {
    const wall = getKeyByValue(ASCII_map, "wall");
    const ground = getKeyByValue(ASCII_map, "ground");    
    bitVals = bitmaskValues(grid, wall, ground);

    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        //if (grid[i][j] == "_") {
        // get feature (i.e. walls, ground, etc.) represented by current ASCII key
        let feature = ASCII_map[grid[i][j]];
        let trans = getTransTile(bitVals[i][j]);
        let tile = { }
        if(!trans){
            tile = {
                i: floor(random(world[worldType][feature].cols)),
                j: floor(random(world[worldType][feature].rows)),
            }
        } else {
            tile = {
                i: world[worldType].wall.transition[trans].i,
                j: world[worldType].wall.transition[trans].j,
            }
        }

        placeTile(i, j, tile.i, tile.j);
      }
    }
    

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
function bitmaskValues(grid, mask, target){
    let result = [];
    // bits associates with directions for bitmap
    let N = 0b0001; // north
    let W = 0b0010; // west
    let E = 0b0100; // east
    let S = 0b1000; // south

    const empty = getKeyByValue(ASCII_map, "empty");
    for(let i = 0; i < numRows; i++){
        result[i] = [];
        for(let j = 0; j < numCols; j++){
            let bit = 0b0000;
            let val = grid[i][j];
            if(val === mask){
                if(i > 0 && grid[i-1][j] === target){ // if current tile has a NORTH neighbor...
                    // ...add it to current tile's bitmap value
                    bit += N;      
                }
                if(j > 0 && grid[i][j-1] === target){ // if current tile has a WEST neighbor...
                    // ...add it to current tile's bitmap value
                    bit += W;  
                }  
                if(i < numRows-1 && grid[i+1][j] === target){ // if current tile has a NORTH neighbor...
                    // ...add it to current tile's bitmap value
                    bit += S;      
                }
                if(j < numCols-1 && grid[i][j+1] === target){ // if current tile has a WEST neighbor...
                    // ...add it to current tile's bitmap value
                    bit += E;  
                }  
            } 
            result[i][j] = bit;
        }
    }

    return result;
}



/*
// starter code by Prof. Wes Mode, UCSC
// https://docs.google.com/presentation/d/1OPkwo6Sz8nXogSWQyuTtvL0ISECoHGczgLi2WC5mciQ/edit#slide=id.gb8efc4721f_0_83 

//* gridCheck(grid,i,j,target): 
//      If location i,j is inside the grid (not out of bounds), does grid[i][j]==target? 
//      Otherise, return false.             
function gridCheck(grid, i, j, target) {
    if(i < 0 || i > grid[0].length || j < 0 || grid.length){ return false; }
    if(grid[i][j] === target){ return true; }
    return false;
}

//* gridCode(grid,i,j,target): 
//      Form a 4-bit code using gridCheck on the north/south/east/west neighbors of 
//      i,j for the target code. You might use an example like 
//      (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3).      
function gridCode(grid, i, j, target) {
    // TODO
}
  
//* drawContext(grid,i,j,target,ti,tj): 
//      Get the code for this location and target. Use the code as an array index to 
//      get a pair of tile offset numbers. 
//         > const [tiOffset, tjOffset] = lookup[code]; 
//         > placeTile(i, j, ti + tiOffset, tj + tjOffset);      
function drawContext(grid, i, j, target, dti, dtj) {
    // TODO
}
  
//* lookup:  
//      A global variable referring to an array of 16 elements. 
//      Fill this with hand-typed tile offset pairs, e.g. [2,1], so that drawContext
//      does not need to handle any special cases.          
const lookup = [
    [1,1],
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];
*/