const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

const campgroundSchema = Joi.object({
    title : Joi.string().required().escapeHTML(),
    price : Joi.number().required(),
    images: Joi.array().items(Joi.object({
        path : Joi.string().required(),
        filename : Joi.string().required()
    }).required()),
    description : Joi.string().required().escapeHTML(),
    location : Joi.string().required().escapeHTML(),
    deleteImages : Joi.array()
})

const reviewSchema = Joi.object({
    body : Joi.string().required().escapeHTML(),
    rating : Joi.number().required().min(1).max(5)
})

module.exports = { campgroundSchema , reviewSchema};