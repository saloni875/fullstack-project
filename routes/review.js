const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controller/reviews.js");

// review route(POST ROUTE)
router.post("/", isLoggedIn, validateReview,wrapAsync(reviewController.createReview ));

// reveiw delete route(post route)
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;