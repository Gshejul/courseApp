require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/users.route');
const courseRoutes = require('./routes/courses.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);





mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, ()=>{
    console.log(`server is running on this port ${PORT}`);
})