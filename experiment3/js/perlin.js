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
        let level = this.config.LEVEL;
        let scale = this.config.SCALE;          
        
        let empty = getKeyByValue(this.ascii, "empty"); 
        let grass = getKeyByValue(this.ascii, "grass"); 
        let dark_grass = getKeyByValue(this.ascii, "dark_grass"); 
        let shore = getKeyByValue(this.ascii, "shore"); 
        let snow = getKeyByValue(this.ascii, "snow"); 

        noiseSeed(seed);            // use global seed
        for (let x = 0; x < this.h; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.w; y++) {
                let nx = scale * x;
                let ny = scale * y;
            
                let c = level * noise(nx, ny);
            
                this.grid[x][y] = empty;
                if (c > random(40,50)) {       
                    // put terrain
                    this.grid[x][y] = shore;
                    if(c > random(50,52)) this. grid[x][y] = grass;
                    if(c > random(60,63)) this. grid[x][y] = dark_grass;
                    if(c > random(65,70)) this. grid[x][y] = snow;
                }
            }
        }
    }
  
  
}