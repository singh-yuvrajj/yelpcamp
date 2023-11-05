const morgan = require("morgan");
const errorClass = require("../error/errorClass");
const Campground = require('../../model/campground');

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error',"You need to be logged in");
        return res.redirect('/login');
    }
    next();
}
const isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const currground = await Campground.findById(id);
    if(!req.user.equals(currground.author)){
        req.flash('error',"Not authorised");
        return res.redirect(`/campground/${id}`);
    }
    else next();
}

const redirectOriginalUrl  = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
const customFunctions = {
    isLoggedIn,
    redirectOriginalUrl,
    isAuthor
}

module.exports = customFunctions;