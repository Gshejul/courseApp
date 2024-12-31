const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');



router.post('/register', async(req, res)=>{
    try{
        const{name, email, password, role} = req.body;

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            name,
            email,
            password,
            role:role || 'student'
        });

        await user.save();

        const token = jwt.sign({
            userId:user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        );
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Password must be a string' });
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            userId:user._id, role:user.role
        }, process.env.JWT_SECRET, {expiresIn:'24h'})
        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;