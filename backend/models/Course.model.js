const mongoose = require('mongoose');




const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    image:{
        type:String,
        default:''
    },
    category:{
        type:String,
        required:true
    },
    level:{
        type:String,
        enum:['beginner', 'intermediate', 'advanced'],
        default:'beginner'
    },
    content:[{
        title:String,
        description:String,
        videoUrl:String,
        duration:Number
    }],
    enrolledStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
   
}, )




module.exports = mongoose.model('Course', courseSchema);