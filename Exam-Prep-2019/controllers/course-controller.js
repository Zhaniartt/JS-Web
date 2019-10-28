const Course = require('../models/Course')

function handleErrors(err , res , cubeBody){
    let errors = [];
    for (const prop in err.errors) {
        errors.push(err.errors[prop].message)
    }
    res.locals.globalErrors = errors;
    res.render('course/create' , cubeBody)
}

module.exports = {
    getCreate: (req,res) =>{
        res.render('course/create')
    },
    postCreate: async (req,res) => {
        let courseBody = req.body;
        const user = req.user;
        courseBody.users = user.id;
try{
    if(courseBody.isPublic === 'on'){
        courseBody.isPublic = true
    }else{
        courseBody.isPublic = false
    }
    courseBody.creator = req.user.id;
   const course = await Course.create(courseBody);
   res.redirect('/')
}
catch(err){
    handleErrors(err, res, courseBody)
    console.log(err)
}
       
},
details: async (req,res,next)=>{
    const id = req.params.id;
            const course = await Course.findById(id)

            if(!req.user){
            course.isCreator = false;
          res.render('course/details' , {course});   
          return         
        }else{
            const userId = course.creator;
            const courseId = req.user.id;
            const isEnrolled = await User.findById(req.user.id).populate('courses')
            const currentCourses = Array.from(isEnrolled._doc.courses)
                if(currentCourses.length <= 0){
                    course.isEnrolled = false;
                }
const findIfIsEnrolled = currentCourses.filter(x=>
     x.id === id)
                    if(!findIfIsEnrolled){
                        course.isEnrolled = false;
                    }else{
                        course.isEnrolled = true

                    }
            if(!userId ){
                course.isCreator = false;
            }
            else if(userId === courseId){
                course.isCreator = true;
            }else{
                course.isCreator = false;
            }
            res.render('course/details' , {course});
        }

        },
        getEnrolled: (req,res)=>{
          const id = req.params.id;
          const currentUSer = req.user;
          currentUSer.courses = id
         Promise.all([User.findById(currentUSer.id), Course.findById(id)]).then(([u,c]) =>{
             currentUSer.courses.push(c._id);
             c.users.push(req.user.id);
             
             return Promise.all([
                User.findByIdAndUpdate(req.user.id, currentUSer),
                Course.findByIdAndUpdate(c._id, c)
             ])
         }).then(()=>{
             res.render(`course/details/${id}`)
         }).catch(console.error)
    },
    editGet:async (req,res)=>{
        try{
            const id = req.params.id;
            const course = await Course.findById(id)
    
            res.render('course/edit', {course})
        }catch(err){
            handleErrors(err)
            res.redirect('/')
        }
      
    },
    editPost:async (req,res)=>{
        const id = req.params.id;
        try{
              const editedCourse = req.body;
              const currentUSer = req.user;
              currentUSer.courses = id
            editedCourse.creator = req.user.id;
            if(editedCourse.isPublic === 'on'){
                editedCourse.isPublic = true
            }else{
                editedCourse.isPublic = false
            }
            Promise.all([User.findById(currentUSer.id), Course.findById(id)]).then(([u,c]) =>{
                c.users.push(req.user.id);
                c.title = editedCourse.title;
                c.description = editedCourse.description;
                c.imageUrl = editedCourse.imageUrl;
                c.isPublic = editedCourse.isPublic;
                return Promise.all([
                   Course.findByIdAndUpdate(c._id, c)
                ])
            }).then(()=>{
                console.log('here')
                res.redirect(`/`)
            }).catch(console.error)

        }
        catch(err){
           errorHandler(err)
        }

    },
    delete: async (req,res)=>{
        const id = req.params.id;
        console.log(id);

        try{
            await Course.findByIdAndRemove(id)
            res.redirect('/')
        }catch(err){
            errorHandler(err)
        }
    }
}   