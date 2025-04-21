let seed = 0;
let asciiGrid = [];
let numRows, numCols;

let WORLD_TYPE = "dungeon";

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
      transition: {
        "1":    {i: 5,  j: 9},      // BTTM     
        "2":    {i: 4,  j: 10},     // RIGHT   
        "4":    {i: 6,  j: 10},     // LEFT     
        "8":    {i: 5,  j: 11},     // TOP       
      }
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
        "~": "ground",
        "#": "wall",
        "+": "corridor",
        ".": "empty",
    },
    ground: {
      cols: [0],
      rows: [0]
    },
    wall: {
      cols: [0],
      rows: [3],
      transition: {
        "1":    {i: 0,  j: 3},      // BTTM     
        "2":    {i: 0,  j: 3},     // RIGHT   
        "4":    {i: 0,  j: 3},     // LEFT     
        "8":    {i: 0,  j: 3},     // TOP       
      }
    },
    corridor: {
      cols: [0],
      rows: [0]
    },
    empty: {
      cols: [0],
      rows: [1]
    },
    bitmasking: {
      focus: ["wall"],
      target: ["ground"]
    },
    config: {
      MIN_LEAF_SZ: 6,
      MAX_DEPTH: 4,
      RM_PADDING: 1,  // leave room for walls
      MIN_RM_SZ: 6,
      debug: {
          show_partitions: false
      }
    }
  }
}