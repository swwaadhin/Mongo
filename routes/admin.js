const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
//  import {z} from "zod"
const {z}=require("zod");

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
         const username=req.body.username;
         const password=req.body.password;

         await Admin.create({
               username:username,
               password:password

         })
         
            
                res.json({
                    msg:'Admin created successfully'
                })
                 
                  


            
         

});

router.post('/courses', adminMiddleware, async  (req, res) => {
    // Implement course creation logic

    //doing zod validation for better parsing 
    const Schema=z.object({
           title:z.string(),
           description:z.string(),
           imageLink:z.string(),
           price:z.number()

    })

    const result=Schema.safeParse(req.body);
    if(!result.success){
      return  res.status(400).json({
           msg:"invalid type input",
           errors:result.error.errors
        })
    }

    const {title,description,imageLink,price}=result.data;
    try{
      const newCourse=await  Course.create({
            title,
            description,
            imageLink,
            price
            
        })
              console.log(newCourse);
        res.json({
            msg:"course created successfully",CourseId:newCourse._id
        })
    }

    catch(err){
      res.status(500).json({
        msg:"Internal server error"
      })
    }


    
});

router.get('/courses', adminMiddleware,  (req, res) => {
    // Implement fetching all courses logic

    Course.find({})
        .then(function(response){
             res.json({
                course:response
             })
        })

});

module.exports = router;