const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set stataic folder
app.use(express.static(path.join(__dirname, 'livechat')));

const botName = 'Chat Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room );


        socket.join(user.room);


    //Welcome current user
    socket.emit('message', formatMessage(botName,  'Vítejte v Chatu!'));

    //Broadcast when user connects
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage(botName,  `${user.username} se připojil`));

    });

    // Listen for chatMessage
       socket.on('chatMessage', msg => {
           const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',  formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName,  `${user.username} se odpojil`));
        }
        
    });


});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));