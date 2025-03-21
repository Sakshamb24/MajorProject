const Listing= require("./models/listing");
const Review= require("./models/review");
const User = require("./models/user");
module.exports.isLoggedIn=(req,res,next)=>{
  
        console.log(req);
        if(!req.isAuthenticated()){
                // redirect info
        req.session.redirectUrl= req.originalUrl;
        req.flash("error" , "You must be logged in"); 
        return res.redirect("/login");
        }
        next();
}


module.exports.saveRedirectUrl= (req,res,next)=>{
if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
}
next();
};

module.exports.isOwner = async(req,res,next)=>{
let {id} = req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currUser._id)){
          req.flash("error" , "You Don't have permission to edit this listing");
          return res.redirect(`/listings/${id}`);
        }
next();
};


module.exports.isAuthor = async(req,res,next)=>{
let {id,reviewId} = req.params;
let review = await Review.findById(reviewId);
if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You Don't have permission to Delete this review");
        return res.redirect(`/listings/${id}`);
}
next();

};