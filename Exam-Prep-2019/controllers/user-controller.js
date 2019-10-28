const encryption = require('../util/encryption');
const User = require('mongoose').model('User');

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    }, 
    registerPost: async (req, res) => {
        const salt = encryption.generateSalt();
        const hashedPass =
        encryption.generateHashedPassword(salt, req.body.password);
        try {
            const userBody = req.body;
            const user = await User.create({
                username: userBody.username,
                hashedPass,
                salt,
                roles: []
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register', user);
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        try {
            const userBody = req.body;
            const user = await User.findOne({
                username: userBody.username
            });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(userBody.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
  
    }
}
