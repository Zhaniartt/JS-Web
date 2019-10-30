const Expense = require('../models/Expense');
const User = require('../models/User')
module.exports = {
    createExpenseGET: (req,res)=>{
        res.render('expense/new-expense')
    },
    createExpensePOST:  (req,res) =>{
        let expenseBody = req.body;
            expenseBody.user = req.user.id;
            if(expenseBody.report === 'on'){
                expenseBody.report = true
            }else{
                expenseBody.report = false
            }
            Promise.all([Expense.create(expenseBody) , User.findById(req.user)])
            .then(([expense,currentUs])=>{
                expense.creator.push(currentUs.id)
                req.user.expenses.push(expense.id)
                return Promise.all([
                    User.findByIdAndUpdate({_id: req.user.id} , req.user),
                    Expense.findByIdAndUpdate(expense.id, expense)
                ])
            }).then(() => {
                res.redirect('/');
              })
              .catch(console.error);

        }
    ,
    editAmount: (req,res) =>{
        const amountPrice = +req.body.amount;
        const userAccount = req.user.id;
        console.log(amountPrice)
        User.findById(userAccount).then(u =>{
            u.amount += amountPrice
            return User.findByIdAndUpdate({_id: userAccount}, {amount: u.amount})
        })
        res.redirect('/')
    },
    report: (req,res) =>{
        const id = req.params.id;
        const expense = Expense.findById(id).then(expense=>{
            console.log(expense)
            res.render('expense/report' , expense )
        })
    },
    delete: (req,res) =>{
        const id = req.params.id

        Expense.findByIdAndRemove(id).then(()=>{
            console.log('Deleted!')
            res.redirect('/')
        })

    }

}