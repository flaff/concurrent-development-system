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
            Session
                .find({})
                .select('Name CreateDate')
                .exec(function (err, foundSessions) {
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

    let appendMessageToSession = (sessionId, messageData) => {
        return new Promise((resolve, reject) => {
            Session.findOneAndUpdate({_id: sessionId}, {$push: {Messages: messageData}}, {safe: true, upsert: true}, function (err, foundSession) {
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
        appendMessageToSession: appendMessageToSession,
        findSessionById: findSessionById,
        getAllSessions: getAllSessions
    }
};

