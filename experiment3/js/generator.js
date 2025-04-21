/* exported generateGrid, drawGrid */
/* global placeTile */
function generateGrid(numCols, numRows) {
    let grid = [];  // empty
 
    if(WORLD_TYPE === "dungeon"){
        grid = new BSP(numCols, numRows).get();
    }
    if(WORLD_TYPE === "overworld") console.log("meep")
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
function drawGrid(grid, bitmask) {
    let bitVals = (bitmask) ? getBitVals(grid) : null;

    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        //if (grid[i][j] == "_") {
        // get feature (i.e. walls, ground, etc.) represented by current ASCII key
        let feature = ascii[grid[i][j]];
        if(!feature) feature = "empty";     // if random char is input, default to empty
        let trans = `${bitVals[i][j]}`;
        let tile = { }
        if(!trans || trans === '0' || !world[WORLD_TYPE][feature].transition[trans]){
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
    let targetVal = world[WORLD_TYPE].bitmasking.target[0];

    let focus = getKeyByValue(world[WORLD_TYPE].ascii, focusVal);
    let target = getKeyByValue(world[WORLD_TYPE].ascii, targetVal);

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
            let bit = 0b0000;
            let val = grid[i][j];
            if(val === focus){
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