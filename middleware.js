const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

// Check if the user is logged in
module.exports.isLoggedIn = (req,res, next) => {
    if (!req.isAuthenticated())
     {
     req.session.redirectUrl = req.originalUrl; // Save the requested URL
        req.flash("error", "You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

// Save redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Check if the user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Validate listing
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listings);
    if (error) {
        const errMessage = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMessage);
    }
    next();
};

// Validate review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};