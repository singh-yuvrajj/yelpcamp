const express = require('express');
const router = express.Router({ mergeParams: true });
const errorCheck = require('../utilities/error/errorCheck');

const { reviewSchema } = require('../utilities/validator/schema');
const Validator = require('../utilities/validator/index');
const {isLoggedIn} = require('../utilities/middleware');

const { addReview , deleteReview } = require('../controller/reviews')

router.post('/', isLoggedIn,Validator(reviewSchema),errorCheck(addReview));

router.delete('/:review_id',isLoggedIn,errorCheck(deleteReview))

module.exports = router;