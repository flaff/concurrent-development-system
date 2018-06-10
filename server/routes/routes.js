const authGuard = require('../auth.guard');

module.exports = function (router, app, jwt, bcrypt, io, fs) {
    const authRepository = require('../repositories/auth.repository')(bcrypt, jwt);
    const simulationRepository = require('../repositories/simulation.repository')(fs);
    const sessionsRepository = require('../repositories/session.repository')(io);
    const {elementSolidToTriangles, flattenArray, trianglesToThreeJSJson} = simulationRepository;

    router
        .route('/auth/register')
        .post((req, res) => {
            let userCredentials = req.body;

            authRepository.registerNewUser(userCredentials).then((result) => {
                res.status(200).json({
                    status: true,
                    data: result
                });
            }).catch((err) => {
                res.status(401).json({
                    status: false,
                    err: err
                });
            });
        });

    router
        .route('/auth/login')
        .post((req, res) => {
            let userCredentials = req.body;

            authRepository.checkAuth(userCredentials).then((result) => {
                res.status(200).json({
                    status: true,
                    userProfile: result.userProfile,
                    token: result.token
                });
            }).catch((err) => {
                res.status(401).json({
                    status: false,
                    err: err
                });
            });
        });

    router
        .route('/auth/user')
        .get(authGuard, (req, res) => {
            let userId = req.user.Id;

            authRepository.getUserById(userId).then((result) => {
                res.status(200).json({
                    status: true,
                    userProfile: {
                        Id: result._id,
                        Login: result.Login
                    }
                });
            }).catch((err) => {
                res.status(401).json({
                    status: false,
                    err: err
                });
            });
        });

    router
        .route('/simulation/:fileName')
        .get((req, res) => {
            let fileName = req.params.fileName;

            simulationRepository.getFileByName(fileName)
                .then(({elementSolid}) => elementSolid)
                .then((arrayOfSolidElements) => arrayOfSolidElements.filter((es) => !isNaN(Number(es.Id)))) // filter out invalid elements
                .then((arrayOfSolidElementsWithNodes) => arrayOfSolidElementsWithNodes.map(elementSolidToTriangles))
                .then((arrayOfSolidElementsWithArrayOfTriangles) => flattenArray(arrayOfSolidElementsWithArrayOfTriangles))
                .then((arrayOfTriangles) => trianglesToThreeJSJson(arrayOfTriangles))
                .then((json) => res.status(200).json(json))
                .catch((err) => res.status(401).json({
                    status: false,
                    err: err
                })
            );
        });

    router
        .route('/sessions')
        .get(authGuard, (req, res) => {
            sessionsRepository.getAllSessions().then((sessions) => {
                res.status(200).json(sessions);
            }).catch((err) => {
                res.status(401).json(err);
            });
        })
        .post(authGuard, (req, res) => {
            let sessionData = req.body;

            sessionsRepository.createNewSession(sessionData).then((newSession) => {
                res.status(200).json(newSession);
            }).catch((err) => {
                res.status(401).json(err);
            });
        });

    router
        .route('/sessions/:sessionId')
        .get(authGuard, (req, res) => {
            let sessionId = req.params.sessionId;

            sessionsRepository.findSessionById(sessionId).then((session) => {
                res.status(200).json(session);
            }).catch((err) => {
                res.status(401).json(err);
            });
        });
};