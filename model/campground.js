const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:Number,
    image:String,
    description:String,
    location:String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref: 'Review' 
    }]
})

CampgroundSchema.post('findOneAndDelete',async (data)=>{
    if(data){
    const { reviews } = data;
    await Review.deleteMany({_id : { $in : reviews}});
    }
})
module.exports = mongoose.model('Campground',CampgroundSchema);