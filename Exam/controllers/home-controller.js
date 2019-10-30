const Expense = require('../models/Expense');
const User = require('../models/User')
module.exports = {
    index: async (req, res) => {
        if(req.user){
            let expenses = await Expense.find({user: req.user.id})
          
            res.render('home/index', {expenses})
           
        }else{
            res.render('home/index')
        }
          
        },
    error: (req,res)=>{
        res.render('errors/404')
    }
};