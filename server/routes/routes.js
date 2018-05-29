const authGuard = require('../auth.guard');

module.exports = function (router, app, jwt, bcrypt, io, fs) {
    const authRepository = require('../repositories/auth.repository')(bcrypt, jwt);
    const simulationRepository = require('../repositories/simulation.repository')(fs);

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

            simulationRepository.getFileByName(fileName).then((result) => {
                res.status(200).json({
                    status: true,
                    fileData: result
                });
            }).catch((err) => {
                res.status(401).json({
                    status: false,
                    err: err
                });
            });
        });
};