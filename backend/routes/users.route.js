const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { protect } = require('../middleware/auth');



router.get('/profile', protect, async(req, res)=>{
    try{
        const user = await User.findById(req.user._id)
        .populate('purchasedCourses')
        .populate('createdCourses')
        .select('-password');

        res.json(user);    
    }
    catch(error){
        res.status(500).json({msg:'server error', error})
    }
});



router.put('/profile', protect, async(req, res)=>{
    try {
        const{name, email} =req.body;
        const user = await User.findById(req.user._id);

        if(email && email !== user.email){
            const existingUser = await User.findOne({email});
            if(existingUser){
                return res.status(400).json({msg:"email already in use"});

            }
            user.name = name || user.name;
            user.email = email || user.email;

            await user.save();
            res.json({
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                }
            });
        }
    } catch (error) {
        res.status(500).json({msg:'server error', error:error.message})
    }
});



router.get('/purchased-courses', protect, async(req, res)=>{
    try {
        const user = await User.findById(req.user._id)
        .populate({
            path:'purchasedCourses',
            populate:{
                path:'instructor',
                select:'name email'
            }
        });
        res.json(user.purchasedCourses);
    } catch (error) {
        res.status(500).json({msg:'server error', error})
    }
});



router.get('/created-courses', protect, async(req, res)=>{
    try {
        if(req.user.role !== 'instructor'){
            return res.status(403).json({msg:'not authorized'});
        }

        const user = await User.findById(req.user._id)
        .populate('createdCourses');
        res.json(user.createdCourses);
    } catch (error) {
        res.status(500).json({msg:'server error', error})
    }
});



module.exports = router;