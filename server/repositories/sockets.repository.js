const Session = require('../models/session.model');

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        socket.emit('connectedToSocket', {socket: socket.id});

        socket.on('change_room', function (data) {
            //io.sockets.sockets[socket.id].leave('room1');
            let rooms = socket.rooms;
            for (let room in rooms) {
                socket.leave(room);
            }
            socket.join(data.roomId);
            io.to(data.roomId).emit('messageFromServer', {
                author: 'SERVER',
                message: 'NEW USER CONNECT TO SESSION:' + data.Login,
                time: Number(new Date())
            });
            console.log('[' + new Date().toUTCString() + ']', data.Login, ' >> room changed to :' + data.roomId);
        });

        socket.on('message', function (data) {
            console.log('[' + new Date().toUTCString() + ']', data.author, ' >> direct message to xd room: ', data.content);
            io.to(data.roomId).emit('messageFromServer', {
                author: data.author,
                message: data.content,
                time: Number(new Date())
            });
        });

        socket.on('ROTATE_SIMULATION', function (data) {
            console.log('[' + new Date().toUTCString() + ']', data, 'ROTATE_SIMULATION');
            io.to(roomName).emit('ROTATED_SIMULATION', data);
        });
    });

};