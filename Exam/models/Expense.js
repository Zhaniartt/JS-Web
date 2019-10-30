const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new mongoose.Schema({
    merchant: {type: Schema.Types.String, required:true},
    date: { type: Schema.Types.Date, required:true, default: Date.now },
    total: {type : Schema.Types.Number, required: true},
    category: {type: Schema.Types.String, required:true},
    description: {type:Schema.Types.String,required:true,minlength:10, maxlength:50},
    report: {type: Schema.Types.Boolean, required:true , default: false },
    user: {type: Schema.Types.String},
    creator: [{type: Schema.Types.ObjectId ,required:true , ref:'User'}]
})

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
