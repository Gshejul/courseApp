const express = require('express');
const router = express.Router();
const Course = require('../models/Course.model');
const {protect, restrictTo} = require('../middleware/auth')


router.get('/', async(req, res) =>{
    try {
        const courses = await Course.find()
        .populate('instructor', 'name email')
        .select('-content');
        res.json(courses);
    } catch (error) {
        res.status(500).json({msg:'server error', error})
    }
});


router.get('/:id', async(req, res)=>{
    try {
        const course = await Course.findById(req.params.id)
        .populate('instructor', 'name email')
        .populate('ratings.user', 'name');

        if(!course){
            return res.status(404).json({msg:"course not found"});
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Create course (instructors only)

router.post('/', protect,  restrictTo('instructor', 'admin'), async(req, res)=>{
    try {
        const course = new Course({
            ...req.body,
            instructor:req.user._id
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update course (instructor who created the course only)
router.put('/:id', protect, restrictTo('instructor', 'admin'), async(req, res)=>{
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if(course.instructor.toString() !==req.user._id.toString() && req.user.role !=='admin'){
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedCourse) 
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// enroll in course

router.post('/:id/enroll', protect, async(req, res)=>{
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

         // Check if already enrolled
         if (course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        course.enrolledStudents.push(req.user._id);
        await course.save();

        // Add course to user's purchased courses
        req.user.purchasedCourses.push(course._id);
        await req.user.save();

        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add rating and review
router.post('/:id/rate', protect, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({ message: 'You must be enrolled to rate this course' });
        }

        // Check if user has already rated
        const existingRating = course.ratings.find(r => r.user.toString() === req.user._id.toString());
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.review = review;
        } else {
            course.ratings.push({ user: req.user._id, rating, review });
        }

        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// delete course
router.delete('/:id', protect, restrictTo('instructor', 'admin'), async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({msg:'course not found'})
        }

        if(course.instructor.toString()!== req.user._id.toString() && req.user.role !== 'admin'){
            return res.status(404).json({msg:'not authorized to delete this course'})
        }

        await Course.findByIdAndDelete(req.params.id);
        res.json({msg:'Course deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})


module.exports = router;