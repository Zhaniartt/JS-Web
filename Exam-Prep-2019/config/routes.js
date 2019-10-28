const controllers = require('../controllers');
const restrictedPages = require('./auth');
const User = require('../models/User');
require('../models/Course')

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/users/register', controllers.user.registerGet);
    app.post('/users/register', controllers.user.registerPost);
    app.get('/users/logout', controllers.user.logout);
    app.get('/users/login', controllers.user.loginGet);
    app.post('/users/login', controllers.user.loginPost);
    app.get('/course/create' , controllers.course.getCreate);
    app.post('/course/create' , controllers.course.postCreate);
    app.get('/course/details/:id', controllers.course.details);
    app.get('/course/enroll/:id' , controllers.course.getEnrolled);
    app.get('/course/edit/:id' , controllers.course.editGet);
    app.post('/course/edit/:id', controllers.course.editPost);
    app.get('/course/delete/:id', controllers.course.delete);
    
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};