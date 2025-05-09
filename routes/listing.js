const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage }  = require("../cloudConfig");
const upload = multer({ storage});
 


const listingController = require("../controller/listings.js");


router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

//  new listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// show route, update route, delete route 
router.route("/:id")
.get( listingController.showListing)
.put( isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, listingController.deleteListing);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;
