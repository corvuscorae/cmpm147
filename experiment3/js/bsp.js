// Binary Space Partitioning algorithm
//      based on starter code provided by Prof. Graeme Devine, UCSC
let splitVis = undefined;
let grid_gbl;   // global copy of grid to clean up function calls
let set;        // global variable to hold setting passed in by generator

function BSP(grid, w, h, settings){
    let empty = "|";  // make sure this corresponds with val in ASCII_map
    set = settings;
    
    // init an empty dungeon
    for (let i = 0; i < h; i++) {
      let row = [];
      for (let j = 0; j < w; j++) {
        row.push(empty);
      }
      grid.push(row);
    }
    
    grid_gbl = grid;

    // init root node
    let root = {
      x: 0, y: 0,
      w: w, h: h,  // in tiles
      children: [],
      room: undefined
    }
    
    // will hold all spaces portioned by BSP process below
    let leaves = [];

    // BSP dungeon: split space, then put rooms in partitions, then connect rooms
    splitSpace(root, 0, leaves);
    placeRooms(leaves);
    connectRooms(root);

    // DEBUG/demo: show split space overlay 
    if(settings.debug.partitions) showSplits(leaves);
}

//*** STEP ONE: divide space into partitions            ***//
function splitSpace(node, depth, leaves){
    if( maxDepthReached(depth) || nodeTooSmall(node)){
      leaves.push(node);
      return true;
    }
     
    // determine whether split is possible horizontally and/or vertically
    let splitHori = node.w > node.h && node.w > set.MIN_LEAF_SZ * 2;
    let splitVert = node.h >= node.w && node.h > set.MIN_LEAF_SZ * 2;
    
    if(!splitHori && ! splitVert){
      leaves.push(node);
      return true;
    }
    
    let splitDir = chooseSplitDir(splitHori, splitVert);
   
    // split! that! node!
    let splitPoint;
    if(splitDir === "hori"){
      splitPoint = floor(random(set.MIN_LEAF_SZ, node.w - set.MIN_LEAF_SZ));
      node.children[0] = getChild(node, splitPoint, "left");
      node.children[1] = getChild(node, splitPoint, "right");
    } 
    else {  // "vert"
      splitPoint = floor(random(set.MIN_LEAF_SZ, node.h - set.MIN_LEAF_SZ));
      node.children[0] = getChild(node, splitPoint, "up");
      node.children[1] = getChild(node, splitPoint, "down");
    }

    // recursively split child nodes
    splitSpace(node.children[0], depth + 1, leaves);
    splitSpace(node.children[1], depth + 1, leaves);
}

//*** STEP TWO: place rooms inside partitions           ***//
function placeRooms(leaves){
    for(let i = 0; i < leaves.length; i++){
      let leaf = leaves[i];
      let maxW = leaf.w - set.RM_PADDING*2;  // max dims, respecting room padding
      let maxH = leaf.h - set.RM_PADDING*2;
    
      if(maxW >= set.MIN_RM_SZ && maxH >= set.MIN_RM_SZ){
        // randomize size within constaints
        let roomW = floor(random(set.MIN_RM_SZ, maxW));
        let roomH = floor(random(set.MIN_RM_SZ, maxH));
        
        // randomize position within sized space
        let roomX = leaf.x + set.RM_PADDING + floor(random(0, maxW - roomW));
        let roomY = leaf.y + set.RM_PADDING + floor(random(0, maxH - roomH));

        leaf.room = {
            x: roomX, y: roomY,
            w: roomW, h: roomH,
            center: { x: roomX + floor(roomW / 2), y: roomY + floor(roomH / 2) },
        }
      
        // put ground tiles in rooms
        let ground = getKeyByValue(ASCII_map, "ground");
        carveSpace(roomX, roomY, roomW, roomH, ground);

        // put walls around rooms
        let wall = getKeyByValue(ASCII_map, "wall");
        let leftWall = roomX - 1;
        if(leftWall >= 0){ carveSpace(leftWall, roomY-1, 1, roomH+2, wall); }

        let rightWall = roomX + roomW;
        if(rightWall < grid_gbl[0].length){ carveSpace(rightWall, roomY-1, 1, roomH+2, wall); }
        
        let topWall = roomY - 1;
        if(topWall >= 0){ carveSpace(roomX, topWall, roomW, 1, wall); }

        let bttmWall = roomY + roomH;
        if(bttmWall >= 0){ carveSpace(roomX, bttmWall, roomW, 1, wall); }
      }
    }
}

//*** STEP THREE: DFS through BSP tree to connect rooms ***//
function connectRooms(node){
    // external node/leaf found, exit recursion
    if(node.children.length != 2) return;  

    // connect children first
    connectRooms(node.children[0]);
    connectRooms(node.children[1]);

    // find a room in each child's subtree
    let roomA = getRoom(node.children[0]);
    let roomB = getRoom(node.children[1]);

    // if both subtrees have rooms, connect them
    if(roomA && roomB){
        createCorridor(roomA.center, roomB.center);
    }
}

//*** HELPER FUNCTIONS                                  ***//
//* step one helpers:
// check if depth still in valid range (<= MAX_DEPTH)
function maxDepthReached(depth){
    return depth >= set.MAX_DEPTH;
}
  
// check whether node is large enough to be split in two
function nodeTooSmall(node){
    return (node.w <= set.MIN_LEAF_SZ*2 && 
            node.h <= set.MIN_LEAFSZ*2 )
}

// choose whetehr to split node horizontally or vertically
function chooseSplitDir(h, v){
    // if node can be split in either dir, coin flip for dir
    if(h && v){
        return (random() > 0.5) ? "hori" : "vert";
      } 
      else if(h){ return "hori"; }  // only hori is poss
      else{ return "vert"; }        // only vert is poss
}

// generate a child node based on whether its directionality
function getChild(node, split, dir){
    let dx = split * (dir === "right"); // equals split iff dir is right, else 0
    let dy = split * (dir === "down");  // equals split iff dir is down, else 0
    
    // WIDTH
    // left -->     split
    // right -->    node.w - split
    // up, down --> node.w
    let bw = (dir === "left") ? split : node.w; // base width is 0 iff dir is left, else 0
    let dw = (dir === "right") ? split : 0;     // equals split iff dir is right, else 0
    //console.log(dir, " --- bw, dw", bw, dw, " --- nw, spl", node.w, split, " --- eval", bw - dw)
    
    // HEIGHT
    // up -->           split
    // down -->         node.h - split
    // left, right -->  node.h
    let bh = (dir === "up") ? split : node.h; // base width is 0 iff dir is left, else 0
    let dh = (dir === "down") ? split : 0;

    return {
        x: node.x + dx, y: node.y + dy, 
        w: bw - dw, h: bh - dh, 
        children: []
    }
}

//* step two-three helpers:
// replace grid coords with tile
function carveSpace(x, y, w, h, tile){
    for(let i = x; i < x + w; i++){
      for(let j = y; j < y + h; j++){
        grid_gbl[j][i] = tile;
      }
    }
}

//* step three helpers:
// pick a random room in node's subtree
function getRoom(node){
    if(node.room) return node.room;

    // if node doesnt have a room, get one from its children
    let rooms = [];
    findSubtreeRooms(node, rooms);  // get all child nodes' rooms

    // if subtree has rooms, pick one randomly
    return (rooms.length > 0) ? random(rooms) : undefined;
}

// fill rooms[] with all node subtree rooms
function findSubtreeRooms(node, rooms){
    if(node.room){ rooms.push(node.room); }
    else{ node.children.forEach(c => findSubtreeRooms(c, rooms)); }
}

// choose a ranomd point from A to B to carve out for a corridor
function createCorridor(A, B){
    let corridor = getKeyByValue(ASCII_map, "corridor");

    if(random() > 0.5){
        carveSpace(min(A.x, B.x), A.y, abs(A.x - B.x) + 1, 1, corridor)
        carveSpace(B.x, min(A.y, B.y), 1, abs(A.y - B.y) + 1, corridor)
    } else {
        carveSpace(A.x, min(A.y, B.y), 1, abs(A.y - B.y) + 1, corridor)
        carveSpace(min(A.x, B.x), B.y, abs(A.x - B.x) + 1, 1, corridor)
    }
}
  
//* DEBUG UTILS: 
// show partition boundaries
function showSplits(leaves){
    splitVis = undefined;       // clear any old visuals
    splitVis = createGraphics(width, height);

    splitVis.noFill();
    splitVis.strokeWeight(4);
    splitVis.stroke("blue");

    for(let leaf of leaves){
        splitVis.rect(leaf.x*TILE_SIZE, leaf.y*TILE_SIZE, 
            leaf.w*TILE_SIZE, leaf.h*TILE_SIZE);
    }
}