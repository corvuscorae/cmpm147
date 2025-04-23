// Binary Space Partitioning algorithm
//      based on starter code provided by Prof. Graeme Devine, UCSC
class BSP{
  constructor(w, h, config){
    this.grid = [];
    this.w = w;
    this.h = h;

    this.conf = world.dungeon.config;
    this.ascii = world.dungeon.ascii;

    this.leaves = [];
    this.root = [];

    this.generate();
  }

  get(){
    return this.grid;
  }

  generate(){
    let empty = getKeyByValue(this.ascii, "empty");  // make sure this corresponds with val in globals.js -> ascii{}
    
    // init an empty dungeon
    for (let i = 0; i < this.h; i++) {
      let row = [];
      for (let j = 0; j < this.w; j++) {
        row.push(empty);
      }
      this.grid.push(row);
    }
    
    // init root node
    this.root = {
      x: 0, y: 0,
      w: this.w, h: this.h,  // in tiles
      children: [],
      room: undefined
    }
    
    // BSP dungeon: split space, then put rooms in partitions, then connect rooms
    this.splitSpace(this.root, 0);
    this.placeRooms(this.leaves);
    this.connectRooms(this.root);

    // draw room interiors last so they cover corridor marks
    for(let leaf of this.leaves){
      if(leaf.room) this.drawRoom(leaf.room);
    }

    // DEBUG/demo: show split space overlay 
    if(this.conf.debug.show_partitions) this.showSplits(this.leaves);
  }

  //*** STEP ONE: divide space into partitions            ***//
  splitSpace(node, depth){
    if( this.maxDepthReached(depth) || this.nodeTooSmall(node)){
      this.leaves.push(node);
      return true;
    }

    // determine whether split is possible horizontally and/or vertically
    let splitHori = node.w > node.h && node.w > this.conf.MIN_LEAF_SZ * 2;
    let splitVert = node.h >= node.w && node.h > this.conf.MIN_LEAF_SZ * 2;

    if(!splitHori && ! splitVert){
      this.leaves.push(node);
      return true;
    }

    let splitDir = this.chooseSplitDir(splitHori, splitVert);
  
    // split! that! node!
    let splitPoint;
    if(splitDir === "hori"){
      splitPoint = floor(random(this.conf.MIN_LEAF_SZ, node.w - this.conf.MIN_LEAF_SZ));
      node.children[0] = this.getChild(node, splitPoint, "left");
      node.children[1] = this.getChild(node, splitPoint, "right");
    } 
    else {  // "vert"
      splitPoint = floor(random(this.conf.MIN_LEAF_SZ, node.h - this.conf.MIN_LEAF_SZ));
      node.children[0] = this.getChild(node, splitPoint, "up");
      node.children[1] = this.getChild(node, splitPoint, "down");
    }

    // recursively split child nodes
    this.splitSpace(node.children[0], depth + 1);
    this.splitSpace(node.children[1], depth + 1);
  }

  //*** STEP TWO: place rooms inside partitions           ***//
  placeRooms(){
    for(let i = 0; i < this.leaves.length; i++){
      let leaf = this.leaves[i];
      let maxW = leaf.w - this.conf.RM_PADDING*2;  // max dims, respecting room padding
      let maxH = leaf.h - this.conf.RM_PADDING*2;
    
      if(maxW >= this.conf.MIN_RM_SZ && maxH >= this.conf.MIN_RM_SZ){
        // randomize size within constaints
        let roomW = floor(random(this.conf.MIN_RM_SZ, maxW));
        let roomH = floor(random(this.conf.MIN_RM_SZ, maxH));

        // randomize position within sized space
        let roomX = leaf.x + this.conf.RM_PADDING + floor(random(0, maxW - roomW));
        let roomY = leaf.y + this.conf.RM_PADDING + floor(random(0, maxH - roomH));

        leaf.room = {
          x: roomX, y: roomY,
          w: roomW, h: roomH,
          center: { x: roomX + floor(roomW / 2), y: roomY + floor(roomH / 2) },
        }

        this.drawWalls(leaf.room);
      }
    }
  }

  //*** STEP THREE: DFS through BSP tree to connect rooms ***//
  connectRooms(node){
    // external node/leaf found, exit recursion
    if(node.children.length != 2) return;  

    // connect children first
    this.connectRooms(node.children[0]);
    this.connectRooms(node.children[1]);

    // find a room in each child's subtree
    let roomA = this.getRoom(node.children[0]);
    let roomB = this.getRoom(node.children[1]);

    // if both subtrees have rooms, connect them
    if(roomA && roomB){
      this.drawCorridor(roomA, roomB);
    }
  }

  //*** HELPER FUNCTIONS                                  ***//
  //* step one helpers:
  // check if depth still in valid range (<= MAX_DEPTH)
  maxDepthReached(depth){
    return depth >= this.conf.MAX_DEPTH;
  }

  // check whether node is large enough to be split in two
  nodeTooSmall(node){
    return (node.w <= this.conf.MIN_LEAF_SZ*2 && 
            node.h <= this.conf.MIN_LEAFSZ*2 )
  }

  // choose whetehr to split node horizontally or vertically
  chooseSplitDir(h, v){
    // if node can be split in either dir, coin flip for dir
    if(h && v){
        return (random() > 0.5) ? "hori" : "vert";
      } 
      else if(h){ return "hori"; }  // only hori is poss
      else{ return "vert"; }        // only vert is poss
  }

  // generate a child node based on whether its directionality
  getChild(node, split, dir){
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

  //* step two helper
  drawRoom(room){
    // put ground tiles in rooms
    let ground = getKeyByValue(this.ascii, "ground");
    this.carveSpace(room.x, room.y, room.w, room.h, ground);
  }

  drawWalls(room){
    // put walls around rooms
    let wall = getKeyByValue(this.ascii, "wall");
    let leftWall = room.x - 1;
    if(leftWall >= 0){ this.carveSpace(leftWall, room.y-1, 1, room.h+2, wall); }

    let rightWall = room.x + room.w;
    if(rightWall < this.grid[0].length){ this.carveSpace(rightWall, room.y-1, 1, room.h+2, wall); }

    let topWall = room.y - 1;
    if(topWall >= 0){ this.carveSpace(room.x-1, topWall, room.w+2, 1, wall); }

    let bttmWall = room.y + room.h;
    if(bttmWall >= 0){ this.carveSpace(room.x-1, bttmWall, room.w+2, 1, wall); }
  }

  //* step two-three helpers:
  // replace grid coords with tile
  carveSpace(x, y, w, h, tile){
    for(let i = x; i < x + w; i++){
      for(let j = y; j < y + h; j++){
        this.grid[j][i] = tile;
      }
    }
  }

  //* step three helpers:
  // pick a random room in node's subtree
  getRoom(node){
    if(node.room) return node.room;

    // if node doesnt have a room, get one from its children
    let rooms = [];
    this.findSubtreeRooms(node, rooms);  // get all child nodes' rooms

    // if subtree has rooms, pick one randomly
    return (rooms.length > 0) ? random(rooms) : undefined;
  }

  // fill rooms[] with all node subtree rooms
  findSubtreeRooms(node, rooms){
    if(node.room){ rooms.push(node.room); }
    else{ node.children.forEach(c => this.findSubtreeRooms(c, rooms)); }
  }

  // choose a ranomd point from A to B to carve out for a corridor
  drawCorridor(rA, rB){
    let corridor = getKeyByValue(this.ascii, "corridor");
    let A = rA.center;
    let B = rB.center;

    if(random() > 0.0){
        this.carveSpace(min(A.x, B.x), A.y, abs(A.x - B.x) + 1, 1, corridor)
        this.carveSpace(B.x, min(A.y, B.y), 1, abs(A.y - B.y) + 1, corridor)
    } else {
        this.carveSpace(A.x, min(A.y, B.y), 1, abs(A.y - B.y) + 1, corridor)
        this.carveSpace(min(A.x, B.x), B.y, abs(A.x - B.x) + 1, 1, corridor)
    }
  }

  //* DEBUG UTILS: 
  // show partition boundaries
  showSplits(leaves){
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
}