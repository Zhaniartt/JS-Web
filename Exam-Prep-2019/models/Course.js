const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {type: mongoose.Schema.Types.String , required: true , unique: true},
    description: {type: mongoose.Schema.Types.String , required: true , maxlength: 50},
    imageUrl: {type: mongoose.Schema.Types.String, required: true},
    isPublic: {type: mongoose.Schema.Types.Boolean, default: false},
    created: {type: mongoose.Schema.Types.Date,
        default: Date.now },
     users: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
    creator: {type: mongoose.Schema.Types.String}
})

const Course = mongoose.model('Course', courseSchema)
courseSchema.path('title').validate(function(){
    return this.title.length >= 3 && this.name.length<=15;
}, "Name must be between 3 and 15 symbols!")


module.exports = Course;
