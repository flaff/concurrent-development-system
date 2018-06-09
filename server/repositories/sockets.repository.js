const Session = require('../models/session.model');
const sessionRepository = require('../repositories/session.repository')();

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        socket.emit('CONNECTED_TO_SOCKET', {socket: socket.id});

        socket.on('JOIN_ROOM', function (socketData) {
            //             //io.sockets.sockets[socket.id].leave('room1');
            //             let rooms = socket.rooms;
            //             console.log('JOIN_ROOM', rooms, data);
            //             // for (let room in rooms) {
            //             //     socket.leave(room);
            //             // }

            sessionRepository.findSessionById(socketData.sessionId)
                .then((createdSession) => {
                    onCreateSessionMessage(createdSession, socketData, 'SERVER', 'NEW USER CONNECT TO SESSION:' + data.user, 'room changed to :' + createdSession._id);
                })
                .catch((err) => {
                    if (err.Message == 'NOT_FOUND') {
                        sessionRepository.createNewSession({
                            Name: data.sessionName,
                            Event: [{
                                name: 'CREATE',
                                content: `Session cretated by ${data.user}`,
                                time: Number(new Date())
                            }],
                            CreateDate: new Date()
                        }).then((createdSession) => {
                            onCreateSessionMessage(createdSession, socketData, 'SERVER', 'NEW USER CONNECT TO SESSION:' + data.user, 'room changed to :' + createdSession._id);
                        }).catch((err) => {
                            onCreateSessionErrorMessage(err, socketData, 'Create new session error');
                        });
                    } else {
                        onCreateSessionErrorMessage(err, socketData, 'Create new session error');
                    }
                });
        });

        socket.on('SEND_MESSAGE', function (data) {
            let rooms = socket.rooms;
            console.log('SEND_MESSAGE', rooms, data);
            console.log('[' + new Date().toUTCString() + ']', data.author, ' >> direct message to xd room: ', data.content);

            let messageItem = {
                author: data.author,
                content: data.content,
                time: Number(new Date())
            };

            sessionRepository.appendMessageToSession(messageItem);
            io.to(data.room).emit('MESSAGE', messageItem);
        });


        socket.on('LEAVE_ROOM', function (data) {
            console.log('[' + new Date().toUTCString() + ']', data.author, ` >> room ${data.room} leaved`);
            for (let room in rooms) {
                socket.leave(room);
            }
            // io.to(data.room).emit('MESSAGE', {
            //     author: data.author,
            //     message: data.content,
            //     time: Number(new Date())
            // });
        });

        socket.on('ROTATE_SIMULATION', function (data) {
            console.log('[' + new Date().toUTCString() + ']', data, 'ROTATE_SIMULATION');
           // io.to(roomName).emit('ROTATED_SIMULATION', data);
        });


        function onCreateSessionMessage(sessionData, socketEventData, author, content, consoleLogText) {
            socket.join(sessionData._id);
            let messageItem = {
                author: author,
                content: content,
                sessionId: sessionData._id,
                time: Number(new Date())
            };
            io.to(sessionData._id).emit('MESSAGE', messageItem);
            console.log('[' + new Date().toUTCString() + ']', socketEventData.user, ' >> ', consoleLogText);
        }

        function onCreateSessionErrorMessage(content, socketEventData, consoleLogText) {
            socket.emit('MESSAGE_ERROR', content);
            console.log('[' + new Date().toUTCString() + ']', socketEventData.user, ' >> ', consoleLogText);
        }
    });

};