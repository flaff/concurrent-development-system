let Session = require('../models/session.model');

const toFiveDigitString = (i) => Array(6 - String(i + 1).length).join('0') + String(i);

module.exports = function (io) {
    let findSessionById = (sessionId) => {
        return new Promise((resolve, reject) => {
            Session.findById(sessionId, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else if (!foundSession) {
                    reject(new Error('NOT_FOUND'));
                } else {
                    resolve(foundSession);
                }
            });
        });
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
        });
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
        });
    };

    let appendMessageToSession = (sessionId, messageData) => {
        return new Promise((resolve, reject) => {
            Session.findOneAndUpdate({_id: sessionId}, {$push: {Messages: messageData}}, {
                safe: true,
                upsert: true
            }, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundSession);
                }
            });
        });
    };

    let saveSessionFileState = (sessionId, fileUrl) => {
        return new Promise((resolve, reject) => {
            Session.findOneAndUpdate({_id: sessionId}, {
                '$set': {
                    'State.fileUrl': !isNaN(+fileUrl) ? toFiveDigitString(+fileUrl) : fileUrl
                }
            }, {
                safe: true,
                upsert: true
            }, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundSession);
                }
            });
        });
    };

    let saveSessionPostionState = (sessionId, x = 0, y = 0) => {
        return new Promise((resolve, reject) => {
            Session.findOneAndUpdate({_id: sessionId}, {
                '$set': {
                    'State.x': x,
                    'State.y': y
                }
            }, {
                safe: true,
                upsert: true
            }, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundSession);
                }
            });
        });
    };

    let saveSessionAutoPlayState = (sessionId, autoPlay) => {
        return new Promise((resolve, reject) => {
            Session.findOneAndUpdate({_id: sessionId}, {
                '$set': {
                    'State.autoPlay': autoPlay
                }
            }, {
                safe: true,
                upsert: true
            }, function (err, foundSession) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(foundSession);
                }
            });
        });
    };

    return {
        createNewSession: createNewSession,
        appendMessageToSession: appendMessageToSession,
        findSessionById: findSessionById,
        getAllSessions: getAllSessions,
        saveSessionFileState: saveSessionFileState,
        saveSessionPostionState: saveSessionPostionState,
        saveSessionAutoPlayState: saveSessionAutoPlayState
    }
};

