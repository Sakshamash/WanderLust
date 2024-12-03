const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isOwner , validateListing }=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
//used for saving file (images,pdf,etc) as db doenot store files like image as it it in bsoc binary which is small in size but data size is large that why we use multer for saving...uploads is link where we store data in cloud services.
const multer=require('multer');
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});



// Error handling middleware
router.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.render("listings/error.ejs", { message });
});

//all listing and create listing
router
.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn,validateListing,upload.single("listing[image]"), wrapAsync(listingcontroller.createListing));

// New listing route
router.route("/new")
.get(isLoggedIn,(listingcontroller.renderNewForm));

//show route and update route and delete route
router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.UpdateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.DestroyListing));


// Edit listing route
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingcontroller.EditListingForm));


module.exports = router;