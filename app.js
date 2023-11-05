if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const errorClass = require('./utilities/error/errorClass');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const campgroundRoute = require('./router/campground');
const reviewRoute = require('./router/review');
const userRoute = require('./router/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
var MongoStore = require('connect-mongodb-session')(session);

const app = express();
const port = 3000;



const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://127.0.0.1:27017/yelpcamp'

const store = new MongoStore({
    uri : dbUrl,
    touchAfter: 24 * 60 * 60,
    secret: 'thisshouldbeabettersecret!'
   
});

store.on('error', function(error) {
    console.log("error");
});

const sessionConfigs = {
    store,
    secret : 'tempkey',
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 1000000000000,
        maxAge:1000000000000,
        httpOnly : true
    }
}

app.engine('ejs',ejsMate);

app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'/public')));

app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(session(sessionConfigs));
app.use(flash());
app.use(mongoSanitize());


app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/do7shqivw/",
                "https://images.unsplash.com/",
                "https://source.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect(dbUrl)
    .catch((err)=>{
        console.log("Found Error",err);
    })

mongoose.connection.on('error', err => {
    console.error('Error occurred:', err);
    });
mongoose.connection.once('open', err => {
    console.log("DB Connection Established");
    });

app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoute);
app.use('/campground',campgroundRoute);
app.use('/campground/:id/reviews',reviewRoute);

app.get('/',(req,res)=>{
    res.render('home')
})






app.use((req,res,next)=>{
    next(new errorClass(400,"Page not found"));
})

app.use((err,req,res,next)=>{
    res.status(400).render('error',{err});
})




app.listen(port,()=>{
    console.log("Server listening");
})