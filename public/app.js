// socket.io assignment - Yeji Kwon

//opens and connects client to the socket
let socket = io(); 

// Defining universal variables 

//Ellipse Position: Stores all the essential info of the ellipse (the user)
let ellipsePosition;
let r,g,b,x,y,eRadius,foodConsumed;

//Food Position: Stores all the essential info of the food
let foodPosition;
let foodx,foody, fRadius;

// Number of food consumed required for the player to win
let foodLimit;


//listen for confirmation
socket.on('connection',()=>{
    console.log('connected to the server via sockets');
})

// PS Code
function setup() {
    createCanvas(innerWidth*0.5, innerHeight*0.5);
    background(220);

    //Defining initial variable values for ellipse
    x = 100;
    y = 100;
    r = random(0,255);
    g = random(0,255);
    b = random(0,255);
    eRadius = 30;

    // Counter of food consumed by ellipse
    efoodConsumed = 0;

    //Ellipse object that will be passed to the server
    ellipsePosition = {
        x:x, 
        y:y,
        red:r,
        blue:b,
        green:g,
        radius: eRadius,
        foodConsumed: efoodConsumed
    };

    foodx = random(0,innerWidth*0.5);
    foody = random(0,innerHeight*0.5);

    // The first user to eat 3 food objects wins
    foodLimit = 3;
    fRadius = 15;

     //Food object that will be passed to the server
    foodPosition = {
        x: foodx,
        y: foody,
        radius: fRadius
    };

    // Emit the food position to display it 
    socket.emit('foodPositionData', foodPosition);
    socket.emit('ellipsePositionData',ellipsePosition);
  }

function draw() {

    // if the left arrow key is held down, move the circle to the left.
    if (keyIsDown(LEFT_ARROW)) {
        ellipsePosition.x = ellipsePosition.x - 5;
        socket.emit('ellipsePositionData',ellipsePosition);
        }
    
    // if the right arrow key is held down, move the circle to the right. 
    else if (keyIsDown(RIGHT_ARROW)) {
        ellipsePosition.x = ellipsePosition.x + 5;
        socket.emit('ellipsePositionData',ellipsePosition);
    }

    // if the up arrow key is held down, move the circle up.
    else if (keyIsDown(UP_ARROW)) {
        ellipsePosition.y = ellipsePosition.y - 5;
        socket.emit('ellipsePositionData',ellipsePosition);
    }

    // if the down arrow key is held down, move the circle down.
    else if (keyIsDown(DOWN_ARROW)) {
        ellipsePosition.y = ellipsePosition.y + 5;
        socket.emit('ellipsePositionData',ellipsePosition);
    }

    // check collision of the user to the food

    if (dist(ellipsePosition.x, ellipsePosition.y, foodPosition.x, foodPosition.y) < 20 + 20) {
        console.log('COLLISION');

        //increase counter
        ellipsePosition.foodConsumed += 1;
        console.log("food counter"+ellipsePosition.foodConsumed);
        
        //Increase size of the ellipse
        ellipsePosition.radius = ellipsePosition.radius + 8;

        // Place food in another position
        foodPosition.x = random(0,innerWidth*0.5);
        foodPosition.y = random(0,innerHeight*0.5);
        socket.emit('foodPositionData', foodPosition);
    } 

    if (ellipsePosition.foodConsumed > foodLimit) {
        ellipsePosition.foodConsumed = 0;
        socket.emit('winStatus', socket.id);
    }
}


// Draw ellipse based on the data emitted from the server (ellipsePosition)
socket.on('ellipseDataFromServer', (data) => {
    // console.log(data);
    console.log('received');
    fill(data.red,data.blue,data.green);
    drawEllipseWithData(data);
})

// Draw food based on the data emitted from the server (foodPosition)
socket.on('foodDataFromServer', (data) => {
    console.log('received food');
    fill(255);
    drawEllipseWithData(data);
})


// Win condition
socket.on('winnerIDFromServer', (data) => {
    console.log(data + " WON");

    // Restart Game
    background(220);

    //Reset size of the ellipse
    ellipsePosition.radius = 30;
    foodPosition.x = random(0,innerWidth*0.5);
    foodPosition.y = random(0,innerHeight*0.5);
    background(220);
    socket.emit('foodPositionData', foodPosition);
})

// Draw ellipse with the data from server used for both ellipse and food
function drawEllipseWithData(data){
    console.log("DRAWN")
    fill(data.red,data.blue,data.green);
    ellipse(data.x, data.y, data.radius, data.radius);
}
