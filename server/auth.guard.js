const jwt = require('jsonwebtoken');
const config = require('./config/config');

module.exports = function (req, res, next) {
    let token = req.headers['authorize'].replace('"', '');
    jwt.verify(token, config.jwtSalt, function(err, user) {
        if (err) {
            return res.status(401).json({message: 'Unathorized! Login using properly credentials'});
        } else {
            req.user = user; //set the user to req so other routes can use it
            return next();
        }
    });
};