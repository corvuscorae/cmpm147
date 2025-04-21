let seed = 0;
let asciiGrid = [];
let numRows, numCols;

let WORLD_TYPE = "dungeon";

// TILES
const ascii = {
  "~": "ground",
  "#": "wall",
  "+": "corridor",
  ".": "empty",
}

// TILE IDS
const world = {
  dungeon: {
    ascii: {
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
    
  }
}