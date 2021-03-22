const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set stataic folder
app.use(express.static(path.join(__dirname, 'livechat')));

// Run when client connects
io.on('connection', socket => {

    //Welcome current user
    socket.emit('message', 'Vítejte v Chatu!');

    //Broadcast when user connects
    socket.broadcast.emit('message', 'Uživatel se připojil');

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'Uživatel se odpojil');
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));