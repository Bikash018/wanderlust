if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
require('dotenv').config()
// console.log(process.env)

const express = require("express");
const app = express();
const Listings =require("./models/lsiting");
const mongoose = require("mongoose");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema , reviewSchema} = require("./schema")
const Review =require("./models/reviews");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require ("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const {isLoggedIn, validateListing, validateReview} = require("./middleware");


const userRouter = require("./routes/user");
const { index, renderNewForm, showListings, createListings, renderEditForm, updateListings, destroyListings } = require("./controllers/listings");
const router = require("./routes/user");

const multer  = require('multer')
const {storage} = require("./cloudConfig");
const { createReview, destroyReview } = require('./controllers/reviews');
const upload = multer({storage})

const dburl = process.env.ATLASDB_URL

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dburl);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" ,ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// const sessionOptions = {
//     secret : "mysupersecretcode",
//     resave : false,
//     saveUninitialized : true,
//     cookie : {
//         expires : Date.now() + 7*24*60*60*1000 ,
//         maxAge : 7*24*60*60*1000, 
//         httpOnly : true ,
//     }
// };

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
    });
  
  store.on("error", (err) =>{
    console.log("ERROR in MONGO SESSION STORE" ,err);
  });
  
  const sessionOptions= {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24* 60 * 60* 1000,
      maxAge: 7 * 24* 60 * 60* 1000,
      httpOnly: true,
    },
  };

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(req.user);
    next();
})

app.use("/" , userRouter);

  






//Index Route
app.get("/listings" , wrapAsync(index))

//New Route
app.get("/listings/new", isLoggedIn ,renderNewForm)

//Show Route
app.get("/listings/:id" , wrapAsync(showListings))

//create Route

app.post("/listings",isLoggedIn , upload.single("listing[image]"),validateListing,wrapAsync (createListings))

// app.post("/listings" ,isLoggedIn , validateListing,
//     wrapAsync (async(req,res,next)=>{
      
  
//         // let listing = req.body.listing;
//         // if(!req.body.listing){
//         //     next(new ExpressError(400,"Page enter valid data for listing")); 
//         // }
//         const newlisting=new Listings(req.body.listing)
//         newlisting.owner = req.user._id ;
//         // console.log(newlisting);
//         await newlisting.save();
//         req.flash("success" , "New Listing Created successfully");
//         res.redirect("/listings");
//     } 
//     )
  
// )

//Edit Route
app.get("/listings/:id/edit" ,isLoggedIn , renderEditForm);

//update Route

app.put("/listings/:id" ,isLoggedIn, upload.single("listing[image]"),updateListings, validateListing)

//Delete Route

app.delete("/listings/:id" ,isLoggedIn ,destroyListings)

//Reviews Route

//post request 
app.post("/listings/:id/reviews" ,validateReview, wrapAsync(createReview));

//Delete Review Route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(destroyReview));




// app.get("/testlisting" ,async (req,res)=>{
//     let sampleListing = new Listings({
//         title:"My New Villa",
//         description : "By the beach",
//         price :1200,
//         location : "Calungut,Goa",
//         Country :"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!")); 
})  

app.use((err, req, res, next) => {
   let {statusCode=500,message="Something went wrong"} = err;
   res.render("error.ejs",{message}) ;
//    res.status(statusCode).send(message);
});


app.listen(8080,()=>{
    console.log("app is listening to port 8080");
})



 