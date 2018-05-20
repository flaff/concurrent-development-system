module.exports = function (router, app, jwt, bcrypt, io) {
    const authRepository = require('../repositories/auth.repository')(bcrypt, jwt);

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
                    token:  result.token
                });
            }).catch((err) => {
                res.status(401).json({
                    status: false,
                    err: err
                });
            });
        });
};