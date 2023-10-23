const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./model/campground');
const Review = require('./model/review');
const Validator = require('./utilities/validator/index')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const errorCheck = require('./utilities/error/errorCheck');
const errorClass = require('./utilities/error/errorClass')

const { campgroundSchema , reviewSchema } = require('./utilities/validator/schema');

const { nextTick } = require('process');

const app = express();
const port = 3000;

app.engine('ejs',ejsMate);

app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));


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


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campground',errorCheck(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});
}))

app.post('/campground',errorCheck(async (req,res,next)=>{

    const { error } = campgroundSchema.validate(req.body);
    if(error){ 
        const { message } = error.details[0];
        throw new errorClass(400,message);
    }

    const newground = new Campground(req.body);
    await newground.save();
    
    res.redirect('/campground');
}))



app.get('/campground/new',errorCheck(async (req,res)=>{
    res.render('campground/new');
}))


app.get('/campground/:id',errorCheck(async (req,res)=>{
    const {id} = req.params;
    const currground = await Campground.findById(id);
    await currground.populate('reviews');
    res.render('campground/detail',{currground});
}))

app.get('/campground/:id/edit',errorCheck(async (req,res)=>{
    const {id} = req.params;
    const currground = await Campground.findById(id);
    res.render('campground/edit',{currground});
}))

app.put('/campground/:id', Validator(campgroundSchema),errorCheck(async (req,res)=>{
    const {id} = req.params;

    // const { error } = campgroundSchema.validate(req.body);
    // if(error){
    //     const { message } = error.details[0];
    //     throw new errorClass(400,message);
    // }
    await Campground.findByIdAndUpdate(id,req.body);
    res.redirect(`/campground/${id}`);
}))
app.delete('/campground/:id',errorCheck(async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}))
app.post('/campground/:id/reviews', Validator(reviewSchema),errorCheck(async (req,res)=>{

    // const { error } = reviewSchema.validate(req.body);
    // if(error){ 
    //     const { message } = error.details[0];
    //     throw new errorClass(400,message);
    // }

    const currground = await Campground.findById(req.params.id);
    const review = new Review( req.body );
    currground.reviews.push(review);
    await currground.save();
    await review.save();
    res.redirect(`/campground/${req.params.id}`);
}))
app.delete('/campground/:id/reviews/:review_id',errorCheck(async (req,res)=>{
    const { id , review_id} = req.params;

    await Campground.findByIdAndUpdate(id,{ $pull : { reviews : review_id}});
    await Review.findByIdAndDelete(review_id);

    res.redirect(`/campground/${id}`);
}))
app.use((req,res,next)=>{
    next(new errorClass(400,"Page not found"));
})

app.use((err,req,res,next)=>{
    res.status(400).render('error',{err});
})




app.listen(port,()=>{
    console.log("Server listening");
})