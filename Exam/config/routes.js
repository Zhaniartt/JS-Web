const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);    
    app.get('/register',  controllers.user.registerGet);
    app.post('/register',  controllers.user.registerPost);
    app.get('/logout', controllers.user.logout);
    app.get('/login',controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);
    app.get('/expense/add', controllers.expense.createExpenseGET )
    app.post('/expense/add', controllers.expense.createExpensePOST)
    app.post('/amount/refill' , controllers.expense.editAmount)
    app.get('/report/:id', controllers.expense.report)
    app.get('/expense/delete/:id' , controllers.expense.delete)
    app.get('/account', controllers.user.account)
    app.all('*', controllers.home.error);
};