let express = require('express');
let http = require('http');
let io = require('socket.io');

let app = express();
let server = http.createServer(app); // wrap the express app with http
io = new io.Server(server); // use socket.io on the http app

app.use('/', express.static('public'));

//when a socket connects, take the socket object in call back, and display the id in the server
io.sockets.on('connection',(socket)=>{
    console.log("we have a new client: ", socket.id);

    //drop a message on the server when th eserver disconnects
    socket.on('disconnect', ()=> {
        console.log('socket has been disconnected: ', socket.id);
    })

    //listen for a message from this client
    socket.on('ellipsePositionData', (data) => {
        // console.log(data);
        io.sockets.emit('ellipseDataFromServer', data);
    })

    socket.on('foodPositionData', (data) => {
        console.log(data);
        io.sockets.emit('foodDataFromServer', data);
    })

    socket.on('winStatus', (data) => {
        console.log(data);
        console.log(data + "WON!");
        io.sockets.emit('winnerIDFromServer', data);
    })
    
})

// server listening on port
server.listen(4400, () => {
  console.log("server is up and running")
})

