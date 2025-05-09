if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Path= require("path");
const methodOverride = require("method-override");
const ejsMate= require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });




const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static('public'));

const dburl = process.env.ATLASDB_URL;
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", err)
})
 
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
};



main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dburl);
}



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// difine locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewsRouter);
app.use("/", userRouter);

//  error handler middleware
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});
app.use((err,req, res, next) =>{
   let{statusCode= 500,message="something went wrong!"} = err;
   res.status(statusCode).render("error.ejs",{message});
//    res.status(statusCode).send(message);
});
app.listen(8080, ()=>{
    console.log("server is listening to 8080");
});