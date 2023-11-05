
const User = require('../model/user');

const registerUserForm = (req,res)=>{
    res.render('user/register');
}

const registerUser = async (req,res,next)=>{
    const { username , email , password } = req.body;
    const user = new User({ username , email });
    try{
        const currUser = await User.register(user,password);

        req.login(currUser , (err)=>{
            if(err) next(err);
            req.flash('success',`Welcome to yelpcamp ${username}`);
            res.redirect('/campground');
        });
   
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

const loginUserForm = (req,res)=>{
    res.render('user/login');
}

const loginUser = async (req,res)=>{
    req.flash('success',`Welcome back ${req.user.username}`);
    const path = res.locals.returnTo || '/campground';

    res.redirect(path);
}

const logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err) next(err);
        req.flash('success',"Successfully logged out");
        res.redirect('/campground');
    });
   
}


module.exports = {
    registerUser,
    registerUserForm,
    loginUser,
    loginUserForm,
    logoutUser
}