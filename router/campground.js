const express = require('express');
const router = express.Router();
const errorCheck = require('../utilities/error/errorCheck');
const Validator = require('../utilities/validator/index');
const { campgroundSchema , reviewSchema } = require('../utilities/validator/schema');
const {isLoggedIn , isAuthor} = require('../utilities/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index')
const upload = multer({storage})

const { editCampground ,  editCampgroundForm , getAllCampground , getCampground , deleteCampground , newCampgroundForm , addCampground } = require('../controller/campground');


router.route('/')
      .get(errorCheck(getAllCampground))
      .post(isLoggedIn,upload.array('images'),Validator(campgroundSchema),errorCheck(addCampground))


router.get('/new',isLoggedIn,errorCheck(newCampgroundForm))


router.route('/:id')
      .get(errorCheck(getCampground))
      .put(isLoggedIn,isAuthor,upload.array('images'),Validator(campgroundSchema),errorCheck(editCampground))
      .delete(isLoggedIn,isAuthor,errorCheck(deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,upload.array('images'),errorCheck(editCampgroundForm))


module.exports  = router;