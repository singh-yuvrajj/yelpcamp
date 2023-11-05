const express = require('express');
const router = express.Router();

const errorCheck = require('../utilities/error/errorCheck');

const passport = require('passport');
const { isLoggedIn , redirectOriginalUrl } = require('../utilities/middleware/index');
const { loginUser ,loginUserForm,registerUser,registerUserForm,logoutUser} = require('../controller/user')

router.route('/register')
      .get(errorCheck(registerUserForm))
      .post(errorCheck(registerUser))

router.route('/login')
      .get(errorCheck(loginUserForm))
      .post(redirectOriginalUrl,passport.authenticate('local',{ failureFlash : true , failureRedirect : '/login'}),errorCheck(loginUser))

router.get('/logout',isLoggedIn,logoutUser);

module.exports = router;