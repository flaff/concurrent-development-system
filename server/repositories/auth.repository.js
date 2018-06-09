let User = require('../models/user.model');
let config = require('../config/config');

module.exports = function (bcrypt, jwt) {
    let generateHashForPassword = (userPassword) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    reject(err);
                } else {
                    bcrypt.hash(userPassword, salt, function (err, hashedPassword) {
                        if (err) {
                            reject(err);
                        }
                        resolve(hashedPassword);
                    });
                }
            });
        })
    };

    let saveNewUser = (model) => {
        return new Promise((resolve, reject) => {
            let newUser = User(model);
            newUser.save(function (err, savedUser) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(savedUser);
                }
            });
        });
    };

    let getUserByLogin = (login) => {
        return new Promise((resolve, reject) => {
            User
                .findOne({Login: login})
                .select('Login CreateDate')
                .exec(function (err, foundUser) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(foundUser);
                    }
                });
        });
    };

    let getUserById = (id) => {
        return new Promise((resolve, reject) => {
            User
                .findOne({_id: id})
                .select('Login CreateDate')
                .exec(function (err, foundUser) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(foundUser);
                    }
                });
        });
    };

    let getFullUserByLogin = (login) => {
        return new Promise((resolve, reject) => {
            User
                .findOne({Login: login})
                .exec(function (err, savedUser) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(savedUser);
                    }
                });
        });
    };

    let registerNewUser = (userModel) => {
        return new Promise((resolve, reject) => {
            getUserByLogin(userModel.login).then((foundUser) => {
                if (foundUser) {
                    reject('User exist');
                } else {
                    generateHashForPassword(userModel.password).then((hash) => {
                        let newUser = {
                            Password: hash,
                            Login: userModel.login
                        };

                        saveNewUser(newUser)
                            .then((savedUser) => {
                                resolve(savedUser);
                            }).catch((err) => {
                            reject(err);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let checkAuth = (userCredentials) => {
        return new Promise((resolve, reject) => {
            getFullUserByLogin(userCredentials.login).then((foundUser) => {
                if (!foundUser) {
                    reject('User not found in db');
                } else {
                    bcrypt.compare(userCredentials.password, foundUser.Password, function (err, authenticated) {
                        if (err) {
                            reject(err);
                        } else if (authenticated) {
                            let authToken = jwt.sign({Login: foundUser.Login, Id: foundUser._id}, config.jwtSalt, {
                                expiresIn: '72h'
                            });
                            resolve({userProfile: {Login: foundUser.Login, Id: foundUser._id}, token: authToken});
                        } else {
                            reject('Password do not match');
                        }
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    };

    return {
        getUserById: getUserById,
        checkAuth: checkAuth,
        registerNewUser: registerNewUser
    }
};