const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const WrapAsync = require("../utilis/WrapAsync");
const ExpressError = require("../utilis/ExpressError");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review");
const {validatereview,loggedin,isreviewauthor}=require("../loggedin.js");
const reviewcontroller=require("../controllers/reviews.js");
//POST REVIEW
router.post("/", loggedin,validatereview, WrapAsync(reviewcontroller.createreview));

//DELETE REVIEW
// Assuming WrapAsync is a function that wraps async route handlers to catch errors
router.delete("/:reviewId",loggedin, isreviewauthor,WrapAsync(reviewcontroller.deletereview));

module.exports = router;