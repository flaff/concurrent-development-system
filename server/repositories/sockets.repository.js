const Session = require('../models/session.model');
const sessionRepository = require('../repositories/session.repository')();
const toFiveDigitString = (i) => Array(6 - String(i + 1).length).join('0') + String(i),
    AUTOPLAY_INTERVAL = 500;

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        socket.emit('CONNECTED_TO_SOCKET', {socket: socket.id});

        socket.on('disconnect', function() {
            console.log('[' + new Date().toUTCString() + ']', ` >> socket ${socket.id} disconnected`);
        });

        socket.on('JOIN_ROOM', function (socketData) {
            sessionRepository.findSessionById(socketData.sessionId)
                .then((createdSession) => {
                    onCreateSessionMessage(createdSession, socketData, 'SERVER', 'NEW USER CONNECT TO SESSION:' + socketData.user, 'room changed to :' + createdSession._id);
                })
                .catch((err) => {
                    onCreateSessionErrorMessage(err, socketData, 'Session error');
                });
        });

        socket.on('SEND_MESSAGE', function (socketData) {
            let rooms = socket.rooms;
            console.log('SEND_MESSAGE', rooms, socketData);
            console.log('[' + new Date().toUTCString() + ']', socketData.author, ` >> direct message to session: ${socketData.sessionId}`);

            let messageItem = {
                author: socketData.author,
                content: socketData.content,
                time: Number(new Date()),
                type: socketData.type
            };

            sessionRepository.appendMessageToSession(socketData.sessionId, messageItem);
            io.to(socketData.sessionId).emit('MESSAGE', messageItem);
        });

        socket.on('LEAVE_ROOM', function (socketData) {
            for (let sessionId in socket.rooms) {
                socket.leave(sessionId);
                console.log('[' + new Date().toUTCString() + ']', `SERVER >> session ${sessionId} leaved by ${socketData.author}`);
                let messageItem = {
                    author: 'SERVER',
                    content: `USER EXIT: ${socketData.author}`,
                    time: Number(new Date()),
                    type: 'SERVER'
                };

                if (sessionId.match(/^[0-9a-fA-F]{24}$/)) {
                    sessionRepository.appendMessageToSession(sessionId, messageItem);
                }

                io.to(sessionId).emit('MESSAGE', messageItem);
            }
        });

        socket.on('ROTATE_SIMULATION', function (socketData) {
            console.log('[' + new Date().toUTCString() + ']', socketData, 'ROTATE_SIMULATION');
            io.to(socketData.sessionId).emit('ROTATED_SIMULATION', socketData);
        });

        // runtime only TODO db
        const currentStepOfSimulations = {};
        const autoPlaySimulationSessions = {};

        socket.on('CHANGE_SIMULATION', function (socketData) {
            console.log('[' + new Date().toUTCString() + ']', socketData, 'CHANGE_SIMULATION');

            if (!isNaN(+socketData.name)) {
                socketData.name = toFiveDigitString(+socketData.name);
            }

            currentStepOfSimulations[socketData.sessionId] = socketData.name;

            io.to(socketData.sessionId).emit('CHANGED_SIMULATION', {
                name: socketData.name,
                url: 'http://localhost:3001/api/simulation/' + socketData.name
            });
        });

        socket.on('CHANGE_AUTOPLAY_SIMULATION', function (socketData) {
            console.log('[' + new Date().toUTCString() + ']', socketData, 'CHANGE_SIMULATION by', socketData.userName);
            if (socketData.autoPlay) {
                autoPlaySimulationSessions[socketData.sessionId] = socketData.autoPlay;
            } else {
                delete autoPlaySimulationSessions[socketData.sessionId];
            }

            io.to(socketData.sessionId).emit('CHANGED_AUTOPLAY_SIMULATION', {
                autoPlay: socketData.autoPlay
            });
        });

        const autoPlaySimulations = () => {
            const sessionIds = Object.keys(autoPlaySimulationSessions);
            for (let i = 0; i < sessionIds.length; i++) {
                const
                    sessionId = sessionIds[i],
                    currentName = currentStepOfSimulations[sessionId] || 1,
                    nextName = toFiveDigitString(+currentName + 10);

                if (!autoPlaySimulationSessions[sessionId]) {
                    continue;
                }

                // prevent from getting unexisting simulation file; send AUTOPLAY = false
                if (+nextName > 1200) {
                    delete autoPlaySimulationSessions[sessionId];
                    io.to(sessionId).emit('CHANGED_AUTOPLAY_SIMULATION', {
                        autoPlay: false
                    });
                    continue;
                }

                console.log('[AUTO] CHANGED_SIMULATION', sessionId, 'from', currentName, 'to', nextName);

                currentStepOfSimulations[sessionId] = nextName;
                io.to(sessionId).emit('CHANGED_SIMULATION', {
                    name: nextName,
                    url: 'http://localhost:3001/api/simulation/' + nextName
                });
            }
        };

        setInterval(autoPlaySimulations, AUTOPLAY_INTERVAL);


        function onCreateSessionMessage(sessionData, socketEventData, author, content, consoleLogText) {
            socket.join(sessionData._id);
            let messageItem = {
                author: author,
                content: content,
                sessionId: sessionData._id,
                time: Number(new Date()),
                type: 'SERVER'
            };
            io.to(sessionData._id).emit('MESSAGE', messageItem);
            sessionRepository.appendMessageToSession(sessionData._id, messageItem);
            console.log('[' + new Date().toUTCString() + ']', socketEventData.user, ' >> ', consoleLogText);
        }

        function onCreateSessionErrorMessage(content, socketEventData, consoleLogText) {
            socket.emit('MESSAGE_ERROR', content);
            console.log('[' + new Date().toUTCString() + ']', socketEventData.user, ' >> ', consoleLogText);
        }
    });

};