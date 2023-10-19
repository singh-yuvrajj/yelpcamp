const mongoose = require('mongoose');
const Campground = require('../model/campground')
const campgrounds = require('./data');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .catch((err)=>{
        console.log("Found Error",err);
    })

mongoose.connection.on('error', err => {
    console.error('Error occurred:', err);
    });
mongoose.connection.once('open', err => {
    console.log("DB Connection Established");
    });


Campground.insertMany(campgrounds);