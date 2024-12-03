const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const methodOverride=require("method-override");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const ReviewController= require("../controllers/review.js");

//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createReview));
//review delte route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.DestroyReview));

module.exports=router;