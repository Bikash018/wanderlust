const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
     
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
    }
    // console.log(res.locals);
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else {
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else {
        next();
    }
};