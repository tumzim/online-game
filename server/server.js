const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:8080", "https://localhost:8000"],
        methods: ["GET", "POST"],
    }
});
const port = 3000;

// object keeps track of all the players that are currently in the game.
var players = {}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('playerDisconnect', socket.id);
    });

    // create a new player and add it to our players object
    //socket.id is the key 
    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };

    // send the players object to the new player --- only to new player joining
    socket.emit('currentPlayers', players);
    // update all other players of the new player === new players data to everyone
    socket.broadcast.emit('newPlayer', players[socket.id]);


});



server.listen(port, () => {
    console.log(`server is running on port ${3000}`)
})