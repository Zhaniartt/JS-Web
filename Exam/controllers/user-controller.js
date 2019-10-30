const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Expense = require('../models/Expense')
module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = await req.body;
        if (reqUser.password !== reqUser.repeatPassword) {
            res.render('users/register',{errorMessages: ['Both password should match!']});
            return;
        }
        
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, reqUser.password);
        try {
            const user = await User.create({
                username: reqUser.username,
                password: reqUser.password,
                hashedPass,
                salt,
                roles: ['User'],
                amount: reqUser.amount
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            if(e.name === 'ValidationError' ){
              const errorMessages=  Object.entries(e.errors).map(t=> t[1].message)
                console.log(errorMessages)
                res.render('users/register' , {errorMessages});
                return;
            }else if(e.name === 'MongoError'){
                res.render('register', {errorMessages: ['User already exist!']})
            }
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
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                res.render('users/login' , {errorMessages: ['Invalid user data']});
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                res.render('users/login' , {errorMessages: ['Invalid user data']});
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    if(err.name === 'ValidationError' ){
                        const errorMessages=  Object.entries(err.errors).map(t=> t[1].message)
                          console.log(errorMessages)
                          res.render('users/login' , {errorMessages});
                          return;
                      }else if(err.name === 'MongoError'){
                          res.render('users/register', {errorMessages: ['User already exist!']})
                      }
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            if(e.name === 'ValidationError' ){
                const errorMessages=  Object.entries(e.errors).map(t=> t[1].message)
                  console.log(errorMessages)
                  res.render('users/login' , {errorMessages});
                  return;
              }else if(e.name === 'MongoError'){
                  res.render('users/register', {errorMessages: ['User already exist!']})
              }
        }

    },
    account:async (req,res)=>{
        const id = req.user.id;
        const currentUser = await User.findById(id).populate('expenses')
        const temp = Array.from(currentUser.expenses)
        const merches = temp.length
        let total = 0;
        
        Object.values(temp).map(x=>{
            total += x.total
        })
        let amount
        if(+currentUser.amount - total < 0){
            amount = 0
        }else{
            amount = +currentUser.amount - total
        }
       const currentUs = {
           total,
           merches,
           amount
       }
       res.render('users/accountInfo' , currentUs)
    }
};