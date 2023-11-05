const Campground = require('../model/campground');
const Review = require('../model/review');

const addReview = async (req,res)=>{
    const currground = await Campground.findById(req.params.id);
    const review = new Review( req.body );
    review.user = req.user;
    currground.reviews.push(review);
    await currground.save();
    await review.save();
    req.flash('success','SuccessFully created reviews');
    res.redirect(`/campground/${req.params.id}`);
}

const deleteReview = async (req,res)=>{
    const { id , review_id} = req.params;
    const review = await Review.findById(review_id);
    if(!req.user.equals(review.user)){
        req.flash('error',"Cant delete review");
        return res.redirect(`/campground/${id}`);
    }
    await Campground.findByIdAndUpdate(id,{ $pull : { reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success','SuccessFully deleted review');

    res.redirect(`/campground/${id}`);
}

module.exports = {
    addReview,
    deleteReview
}