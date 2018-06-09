let Session = require('../models/session.model');

module.exports = function (io) {
    let findSessionById = (sessionId) => {
        return new Promise((resolve, reject) => {
            Session.findById(sessionId, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else if(!foundSession) {
                    reject(new Error('NOT_FOUND'));
                } else {
                    resolve(foundSession);
                }
            });
        })
    };

    let getAllSessions = () => {
        return new Promise((resolve, reject) => {
            Session.find({}, function (err, foundSessions) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundSessions);
                }
            });
        })
    };

    let createNewSession = (sessionData) => {
        return new Promise((resolve, reject) => {
            let newSession = new Session(sessionData);

            newSession.save(function (err, savedSession) {
                if (err) {
                    reject(err);
                }
                else {
                    io.sockets.emit('SESSION_LIST_REFRESH', 'test');
                    resolve(savedSession);
                }
            });
        })
    };

    let appendEventToSession = (sessionId, eventData) => {
        return new Promise((resolve, reject) => {
            Session.findOneAndUpdate({_id: sessionId}, {$push: {Events: eventData}}, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundSession);
                }
            });
        })
    };

    let appendMessageToSession = (sessionId, messageData) => {
        return new Promise((resolve, reject) => {
            Session.findOneAndUpdate({_id: sessionId}, {$push: {Messages: messageData}}, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundSession);
                }
            });
        })
    };

    return {
        createNewSession: createNewSession,
        appendEventToSession: appendEventToSession,
        appendMessageToSession: appendMessageToSession,
        findSessionById: findSessionById,
        getAllSessions: getAllSessions
    }
};

