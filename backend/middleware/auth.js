const jwt = require('jsonwebtoken');
const User = require("../models/User.model");



exports.protect = async(req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ 
                message: 'No Authorization header found',
                details: 'Please add Authorization header with Bearer token'
            });
        }
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Invalid token format',
                details: 'Token must start with "Bearer "'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ 
                message: 'No token found',
                details: 'Token is missing after Bearer prefix'
            });
        }


        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return res.status(401).json({ 
                    message: 'User not found',
                    details: 'The user associated with this token no longer exists'
                });
            }

            req.user = user;
            next();
        } catch (jwtError) {
            return res.status(401).json({ 
                message: 'Invalid token',
                details: jwtError.message
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error during authentication',
            details: error.message
        });
    }
};


exports.restrictTo = (...roles) =>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                 message: 'You do not have permission to perform this action'
            });
        }
        next();
        
    };
};