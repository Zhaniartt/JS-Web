const encryption = require('../util/encryption');
const User = require('mongoose').model('User');

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    }, 
    registerPost: async (req, res) => {
        const user = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, user.password);
        try {
            const user = await User.create({
                username: user.username,
                hashedPass,
                salt,
                firstName: user.firstName,
                lastName: user.lastName,
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
            res.render('users/register');
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
        const user = req.body;
        try {
            const user = await User.findOne({
                username: user.username
            });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(user.password)) {
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
    },
    blockUser: async (req, res) => {
        try {
            req.user.blockedUsers.push(req.params.username);
            await req.user.save();
            res.redirect('/thread/' + req.params.username);
        } catch (err) {
            console.log(err);
        }
    },
    unblockUser: async (req, res) => {
        try {
            req.user.blockedUsers = req.user.blockedUsers.filter(user => user !== req.params.username);
            await req.user.save();
            res.redirect('/thread/' + req.params.username);
        } catch (err) {
            console.log(err);
        }
    }
};