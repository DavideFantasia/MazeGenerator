//COLOR VARIABLES
var bgColor = 51;   //background color
var vColor = [169, 59, 209,100]; //visited cell color
var hColor = [0,0,255,50]; //highlighted cell color
//UTILITIES
var cols, rows; //global variables for the maze dimensions
var w = 10; //for the width of each cell;
var grid = [] //matrix stored as an array for keeping all the cell index
var current;    //pointer at the current cell that is being visited
var queue = [] // queue for the back-tracking (like BFS)
//CANVAS DIMENSIONS
var canvasMaxX = 100;   //px
var canvasMaxY = 100;   //px

function setup(){
    frameRate(60);   //setting fps
    createCanvas(canvasMaxX,canvasMaxY);
    cols = floor(width/w); //number of cols and rows
    rows = floor(height/w);

    //init of the matrix
    for(let j=0; j<rows; j++){
        for(let i=0; i<cols; i++){
            var cell = new Cell(i,j)
            grid.push(cell);
        }
    }
    current = grid[0];  //setting the current cell as the one on the top left corner
}

function draw(){

    background(bgColor)
    //first print of the empty grid
    for(let i=0; i<grid.length; i++){
        grid[i].show();
    }
    current.visited=true;//initializing the first cell;
    current.highlight();
    var  next = current.checkNeighbors();   //STEP 1
    if(next){ //if defined
        next.visited = true;    
        //STEP 2
        queue.push(current);
        //STEP 3
        removeWalls(current,next);
        //STEP 4
        current = next; 
    }else if(queue.length>0){
        current = queue.pop(); //recursive step yaaaay
    }

}


//Cell class, simulating a space of the maze, with his coordinates and the characteristic array for the walls
class Cell{
    constructor(i,j){
        this.i = i;
        this.j = j;
        this.walls = [true,true,true,true]; //characteristic array for the walls
        this.visited = false;   //boolean for determine if the DFS has already visited this cell
    }

    show(){
        //coordinates (x,y) in the grid when the width of each cell is w
        let x = this.i*w;
        let y= this.j*w;

        stroke(0);
        if(this.walls[0])
            line(x,y,x+w,y);    //top line
        if(this.walls[1])
            line(x+w,y, x+w,y+w);   //right line
        if(this.walls[2]) 
            line(x+w,y+w, x,y+w);   //bottom line
        if(this.walls[3])
            line(x,y+w,x,y);    //left line


        if(this.visited){
            noStroke()
            fill(vColor[0],vColor[1],vColor[2],vColor[3]); //changing the color if the cell is visited
            rect(x,y,w,w);  //draw a rectangle at coordinates (x,y) with width = w and height = w
        }
        
        
    }
    checkNeighbors(){
        let neighbors = [];

        let top = grid[ indexOf(this.i , this.j -1) ]
        let right = grid[ indexOf(this.i +1 , this.j) ]
        let bottom = grid[ indexOf(this.i , this.j +1) ]
        let left = grid[ indexOf(this.i -1, this.j) ]
        //the AND connection needs to see if the coordinates are right and not out of array
        //if out of array, the would point at the grid[-1]'s elements, witch is undefined
        //undefined in js is read as a FALSE in an IF statement. aw, the joys of JS
        if(top && !top.visited)    neighbors.push(top);
        if(right && !right.visited)    neighbors.push(right);
        if(bottom && !bottom.visited)    neighbors.push(bottom);
        if(left && !left.visited)    neighbors.push(left);

        if(neighbors.length > 0){
            var r = floor( random(0,neighbors.length) );
            return neighbors[r];    //returning a random neighbor
        }
        return undefined;   //if there aren't any neighbors
    }

    highlight(){
        let x = this.i*w;
        let y= this.j*w;
        noStroke();
        fill(hColor[0],hColor[1],hColor[2],hColor[3]);
        rect(x,y,w,w)
    }
}

function indexOf(x,y){

    if(x<0 || y<0 || x>cols-1 || y>rows-1){
        console.log("index out of array");
        return -1;
    }

    return x+y*cols;
}

function removeWalls(a,b){
    let y = a.j - b.j;
    let x = a.i - b.i;
    if(x==1){
        a.walls[3] = false;
        b.walls[1] = false;
    }else if(x==-1 ){
        a.walls[1] = false;
        b.walls[3] = false;
    }

    if(y==1){
        a.walls[0] = false;
        b.walls[2] = false;
    }else if(y==-1){
        a.walls[2] = false;
        b.walls[0] = false;
    }
}