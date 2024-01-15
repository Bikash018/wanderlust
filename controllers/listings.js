const Listings =require("../models/lsiting");

module.exports.index = async (req,res)=>{
    const allListings=await Listings.find({});
    res.render("listings/index.ejs" , {allListings});

}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListings = async(req,res)=>{
    const {id} = req.params;
   
    const listing = await Listings.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing});
}

module.exports.createListings = async(req,res,next)=>{
        
    
    // let listing = req.body.listing;
    // if(!req.body.listing){
    //     next(new ExpressError(400,"Page enter valid data for listing")); 
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting=new Listings(req.body.listing)
    newlisting.owner = req.user._id ;
    newlisting.image = {url , filename};
    // console.log(newlisting);
    await newlisting.save();
    req.flash("success" , "New Listing Created successfully");
    res.redirect("/listings");
} 

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listings.findById(id);
    // console.log(listing);
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListings = async (req,res)=>{
    let { id }= req.params;
    let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing});
 
     if(typeof req.file !== "undefined") { 
    let url = req.file.path;
    let filename = req.file.filename;
     listing.image = {url, filename};
     await listing.save();
   }
     req.flash("success", "Listing Updated!");
     res.redirect(`/listings/${id}`);
}

module.exports.destroyListings =  async (req,res)=>{
    const {id} = req.params;
    let deletedListing = await Listings.findByIdAndDelete(id) ;
    req.flash("success" , " Listing Deleted  successfully");
    res.redirect("/listings");
}