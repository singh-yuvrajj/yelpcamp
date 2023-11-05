const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary/index');


const ImageSchema = new Schema(
    {
        path : String,
        filename : String
    }
)

ImageSchema.virtual('thumbnail').get(function(){
    return this.path.replace('/upload','/upload/w_200');
})

const CampgroundSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:Number,
    images : [ ImageSchema ],
    description:String,
    location:String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref: 'Review' 
    }],
    author :{
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    deleteImages : Array
})

CampgroundSchema.post('findOneAndDelete',async (data)=>{
    if(data){
    const { reviews } = data;
    await Review.deleteMany({_id : { $in : reviews}});
    for(let currImage of data.images){
        await cloudinary.uploader.destroy(currImage.filename);
    }
    }
})
module.exports = mongoose.model('Campground',CampgroundSchema);