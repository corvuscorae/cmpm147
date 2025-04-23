let tilesetImage;
const TILE_SIZE = 16;   // size of tiles in tileset, in px

let seed = 0;
let asciiGrid = [];
let numRows, numCols;
let gfx_changed = true;

let WORLD_TYPE = "overworld";

// TILE IDS
const world = {
  dungeon: {
    ascii: {
      // TUNABLE: ascii symbols to represent each structure
      // REQUIRED: "ground", "wall", "corridor", and "empty" values 
      //    > values cannnot be changes unless you also change them in bsp.js
      //    > if you want to add more values, you'll have to define their ascii,
      //      define placement logic in bsp, and add an attribute with the same
      //      name to dungeon object 
      //      (i.e. "&": "monster" --> add monster: {$tile_info})
        "~": "ground",
        "#": "wall",
        "+": "corridor",
        ".": "empty",
    },
    ground: {
      cols: [0, 1, 2, 3],
      rows: [9]
    },
    wall: {
      cols: [21],
      rows: [21],
    },
    corridor: {
      cols: [0, 1, 2, 3],
      rows: [9]
    },
    empty: {
      cols: [21, 22, 23, 24],
      rows: [21, 22, 23, 24]
    },
    bitmasking: {
      focus: ["wall"],
      target: ["ground"]
    },
    gfx: {},
    config: {
      MIN_LEAF_SZ: 6,
      MAX_DEPTH: 4,
      RM_PADDING: 1,  // leave room for walls
      MIN_RM_SZ: 6,
      debug: {
          show_partitions: false
      }
    }
  },
  overworld: {
    ascii: {
      // TUNABLE: ascii symbols to represent each structure
      // REQUIRED: "ground", "wall", "corridor", and "empty" values 
      //    > values cannnot be changes unless you also change them in bsp.js
      //    > if you want to add more values, you'll have to define their ascii,
      //      define placement logic in bsp, and add an attribute with the same
      //      name to dungeon object 
      //      (i.e. "&": "monster" --> add monster: {$tile_info})
      // IMPORTANT: these values will be used to create layers in generator.js
      //    --> make sure to define in layer order (first defined = bottom layer)
        "~": "empty",
        "+": "shore",
        "-": "grass",
        "^": "forest",
    },
    grass: {
      cols: [0,1,2,3],
      rows: [0],
      transition: {                   
        "N":  {i: 5, j: 2},
        "E":  {i: 4, j: 1},
        "S":  {i: 5, j: 0},
        "W":  {i: 6, j: 1},
      }
    },
    water: {
      cols: [0, 1, 2, 3],
      rows: [14],
    },
    forest: {
      cols: [14],
      rows: [0]
    },
    shore: {
      cols: [0,1,2,3],
      rows: [3],
      transition: {                   
        "N":  {i: 5, j: 5},
        "E":  {i: 4, j: 4},
        "S":  {i: 5, j: 3},
        "W":  {i: 6, j: 4},
      }
    },
    empty: {        
      cols: [0,1,2,3],
      rows: [14]
    },
    bitmasking: {
      focus: [],
      target: []
    },
    gfx: {},
    config: {
      // noise settings
      MIN_LEAF_SZ: 6,
      MAX_DEPTH: 4,
      RM_PADDING: 1,  // leave room for walls
      MIN_RM_SZ: 6,
      debug: { }
    }
  }
}

/*
      transition: {                   // neighbors at....
        "0":    {i: 0,  j: 4},        // X     
        "1":    {i: 0,  j: 4},        // N
        "2":    {i: 0,  j: 4},        // W
        "3":    {i: 0,  j: 4},        // N, W
        "4":    {i: 0,  j: 4},        // E
        "5":    {i: 0,  j: 4},        // N, E     
        "6":    {i: 0,  j: 4},        // W, E 
        "7":    {i: 0,  j: 4},        // N, E, W 
        "8":    {i: 0,  j: 4},        // S  
        "9":    {i: 0,  j: 4},        // N, S      
        "10":   {i: 0,  j: 4},        // S, E   
        "11":   {i: 0,  j: 4},        // N, S, E   
        "12":   {i: 0,  j: 4},        // E, S
        "13":   {i: 0,  j: 4},        // N, E, S   
        "14":   {i: 0,  j: 4},        // E, S, W
        "15":   {i: 0,  j: 4},        // N, E, S, W
      }
*/

// holds arrays of neighbor directions for each transition type
// (basically, which direction we need to add trans tiles in; 0 --> add a trans tile in every dir)
const TRANS_DIR = {
  "0":    ["N", "E", "S", "W"],
  "1":    ["E", "S", "W"],
  "2":    ["N", "E", "S"],
  "3":    ["E", "S"],
  "4":    ["N", "S", "W"],
  "5":    ["S", "W"],
  "6":    ["N", "S"],
  "7":    ["S"],   
  "8":    ["N", "E", "W"],
  "9":    ["E", "W"],
  "10":   ["N", "E"],
  "11":   ["E"],
  "12":   ["N", "W"],
  "13":   ["W"],
  "14":   ["N"],
  "15":   [],
}

// x, y offsets for directions
const DIR = {
  "W": {dx:  0,  dy: -1},
  "S": {dx:  1,  dy:  0},
  "E": {dx:  0,  dy:  1},
  "N": {dx: -1,  dy:  0},
}
