const Course = require('../models/Course')
module.exports = {
    index:  (req, res) => {
    Course.find({}).then((courses) =>{
        if(!courses){
            req.courses = false
        }else{
            res.render('home/index',{courses})
        }
    })       
    }
};