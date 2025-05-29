const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { Admin, User, Course } = require("../db");

// User Routes
router.post('/signup',  (req, res) => {
    // Implement user signup logic
    const username=req.body.username;
    const password=req.body.password;
    User.create({
        username,
        password
    })

    res.json({
        msg:"user created successfully"
    })
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const response=await Course.find({});
    
   res.json({
    course:response
   })

    

});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    //needed the course id from the parameter
    const courseId=req.params.courseId;
    const username=req.body.username;
    User.updateOne({
        username:username
    },{
           "$push":{
            purchasedCourses:courseId,
           }
    })

    res.json({
        msg:"purchased completed!"
    })

});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
  
    const user= await User.findOne({
     username:req.headers.username
    })

    const course=await Course.find({
        _id:{
            "$in":user.purchasedCourses
        }
    })

    res.json({
            course:course
    })
});

module.exports = router