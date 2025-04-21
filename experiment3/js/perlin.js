class PerlinWorld{
    constructor(w, h){
        this.grid = [];
        this.w = w;
        this.h = h;

        this.config = world[WORLD_TYPE].config;
        this.ascii = world[WORLD_TYPE].ascii;

        this.generate();
    }

    get(){
        return this.grid;
    }

    generate() {
        let level = 100;
        let scale = 0.08;           // lower = larger scale

        let empty = getKeyByValue(this.ascii, "empty"); 
        let grass = getKeyByValue(this.ascii, "grass"); 
        let shore = getKeyByValue(this.ascii, "shore"); 

        noiseSeed(seed);            // use global seed
        for (let x = 0; x < this.h; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.w; y++) {
                let nx = scale * x;
                let ny = scale * y;
            
                let c = level * noise(nx, ny);
            
                if (c < 50) { 
                    // leave empty (for water)
                    this.grid[x][y] = empty;
                } 
                else {       
                    // put terrain
                    this.grid[x][y] = grass;

                    //if(c < 100 && c > 90) this.grid[x][y] = "+" // forest
                    if(c < 60) this. grid[x][y] = shore
                }
            }
        }
    }
  
  
}