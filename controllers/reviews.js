const Listings =require("../models/lsiting");
const Review = require ("../models/reviews");

module.exports.createReview =  async (req,res) =>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review (req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} =req.params;
    await Listings.findByIdAndUpdate(id,{$pull : {reviews : reviewId}}) 
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}