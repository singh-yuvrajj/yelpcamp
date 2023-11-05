

const Campground = require('../model/campground');
const { cloudinary } = require('../cloudinary/index');

const getAllCampground = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});
}

const addCampground = async (req,res,next)=>{
    const newground = new Campground(req.body);
    newground.author = req.user.id;
    newground.images = req.files.map((data)=>({ path : data.path , filename : data.filename }));
    await newground.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campground/${newground.id}`);
}

const newCampgroundForm = async (req,res)=>{
    res.render('campground/new');
}

const getCampground = async (req,res)=>{
    const {id} = req.params;
    const currground = await Campground.findById(id);
    if(!currground){
        req.flash('error',"cant find campground");
        return res.redirect('/campground');
    }
    await (await currground.populate({ 
        path : 'reviews',
        populate : {
            path : 'user'
        }
    })).populate('author');
    res.render('campground/detail',{currground});
}

const editCampground = async (req,res)=>{

    const {id} = req.params;
    const newImages = req.files.map((data)=>({ path : data.path , filename : data.filename }));
    const currground = await Campground.findByIdAndUpdate(id,req.body);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await currground.updateOne({$pull : { images : {filename : { $in : req.body.deleteImages }}}});
    }
    currground.images.push(...newImages);
    await currground.save();
    req.flash('success',"Successfully updated campground");
    res.redirect(`/campground/${id}`);

}

const deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    
    req.flash('success',"Successfully deleted campground");
    res.redirect('/campground');
}

const editCampgroundForm = async (req,res)=>{
    const {id} = req.params;
    const currground = await Campground.findById(id);
    res.render('campground/edit',{currground});
}

module.exports = {
    editCampground,
    editCampgroundForm,
    addCampground,
    newCampgroundForm,
    deleteCampground,
    getAllCampground,
    getCampground
}