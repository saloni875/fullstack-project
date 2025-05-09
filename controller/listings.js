const Listing = require("../models/listing");
const { all } = require("../routes/listing");


module.exports.index = async (req, res, next) => {
    try{
        const {q} = req.query;
        let allListing;
        if(q){
            allListing = await Listing.find({
                $or:[
                    {
                        title: { $regex: q, $options : "i"}
                    },
                    {
                        location: {$regex : q, $options: "i"}
                    },
                ],
            });
        } else{
            allListing = await Listing.find({});
        }
        // res.render("listing/index.ejs", { allListing });
        // const allListing = await Listing.find({});
        res.render("listings/index.ejs", { allListing });

    }catch(err){
        next(err);
    }
    

}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("owner");
        // console.log(listing)
        res.render("listings/shows.ejs", { listing });
    } catch (err) {
        next(err);
    }

}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    console.log(req.body);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    console.log(req.body.listing); // Log the newListing object
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

    console.log("Listing Data:", listing);
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
    }
    listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing, image: listing.image }, { new: true });
    req.flash("success", "listing updated");
    res.redirect(`/listing/${id}`);
  };
  

module.exports.deleteListing = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success", "listing deleted");
        console.log("we deleted", deletedListing);
        res.redirect("/listing");
    } catch (err) {
        next(err);
    }

}
