const Listing = require("../models/listing");
const Review = require("../models/review")

module.exports.createReview = async(req,res) =>{
    console.log(req.params.id); 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview._id);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review save");
    req.flash("success", "new review added");
    res.redirect(`/listing/${req.params.id}`);
   
}

module.exports.deleteReview= async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "new review deleted");
    res.redirect(`/listing/${id}`);
    
}