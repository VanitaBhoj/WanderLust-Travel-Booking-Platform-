const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");//helps to create diff layouts and templates.Also called includes/partials
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expressError.js");
const {listingSchema} =require("./schema.js");
const Review = require("./models/review.js");



const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
main().
then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.send("Hi, I am vanita");
});

const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else next();
};

//Index(create) Route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings =await Listing.find({});
        res.render("listings/index.ejs",{allListings});
}));
//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//Create route
app.post("/listings",
    validateListing,
     wrapAsync(async(req, res,next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }));


//Show Route
app.get("/listings/:id",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
})); 
//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//Update route
app.put("/listings/:id",
    validateListing,
    wrapAsync (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
//Review Post Route
app.post("/listings/:id/reviews",async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save({ validateBeforeSave: false });

    res.redirect(`/listings/${listing._id}`);
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not found!"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})