const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
}
module.exports.showListing=(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    },
}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})
module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner=req.user._id;
    listing.image={url,filename};
    await listing.save();
    req.flash("success", "New listing Created!");
    res.redirect("/listings");
};
module.exports.EditListingForm=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}
module.exports.UpdateListing=async (req, res) => {
    const { id } = req.params;
let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if(typeof req.file !=="undefined"){
let url=req.file.path;
let filename=req.file.filename;
listing.image={url,filename};
await listing.save();
}
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};
module.exports.DestroyListing=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    console.log(deletedListing);
    res.redirect("/listings");
}