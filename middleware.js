const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res, next) => { 
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "please logged in to create a listing!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectURl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner =async (req, res,next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!  listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you don't have access to make changes");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing =(req, res, next)=>{
    let{error}=listingSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next)=>{
    let{error}=reviewSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor =async (req, res,next) =>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!  review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you can't delete this review ");
        return res.redirect(`/listing/${id}`);
    }
    next();
};