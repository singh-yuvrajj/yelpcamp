const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./model/campground')

const app = express();
const port = 3000;


app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));

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

app.get('/campground',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});
})

app.post('/campground',async (req,res)=>{
    const newground = new Campground(req.body);
    await newground.save();
    
    res.redirect('/campground');
})



app.get('/campground/new',async (req,res)=>{
    res.render('campground/new');
})


app.get('/campground/:id',async (req,res)=>{
    const {id} = req.params;
    await Campground.findById(id)
    .then((currground)=>{
        res.render('campground/detail',{currground});
    })
    .catch((err)=>{
        res.render('error',{err});
    })
})

app.get('/campground/:id/edit',async (req,res)=>{
    const {id} = req.params;
    const currground = await Campground.findById(id);
    res.render('campground/edit',{currground});
})

app.put('/campground/:id', async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id,req.body);
    res.redirect(`/campground/${id}`);
})
app.delete('/campground/:id',async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
})

app.listen(port,()=>{
    console.log("Server listening");
})