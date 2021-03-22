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
    console.log('New WS Connection...');

    socket.emit('message', 'Vítejte v Chatu');

    //Broadcast when user connects
    socket.broadcast.emit('message', 'Uživatel se připojil');

});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));