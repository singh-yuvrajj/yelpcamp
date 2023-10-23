const Joi = require('joi');

const campgroundSchema = Joi.object({
    title : Joi.string().required(),
    price : Joi.number().required(),
    image: Joi.string().required(),
    description : Joi.string().required(),
    location : Joi.string().required()
})

const reviewSchema = Joi.object({
    body : Joi.string().required(),
    rating : Joi.number().required().min(1).max(5)
})

module.exports = { campgroundSchema , reviewSchema};