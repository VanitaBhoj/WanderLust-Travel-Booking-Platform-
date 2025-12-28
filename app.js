if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log("SECRET:", process.env.SECRET);
console.log("ATLASDB_URL:", process.env.ATLASDB_URL);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

// ✅ FIXED: Connect FIRST, then setup EVERYTHING
main()
  .then(() => {
    console.log("✅ Connected to DB");

    // ✅ FIXED: MongoStore AFTER DB connection
    const MongoStore = require('connect-mongo');
    const store = MongoStore.create({
      mongoUrl: dbUrl,
      collectionName: 'sessions',
    });
    store.on("error", (e) => {
      console.log("SESSION STORE ERROR", e);
    });

    const sessionOptions = {
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 100,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      }
    };

    // ✅ FIXED ORDER: ejsMate BEFORE views
    app.engine('ejs', ejsMate);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));
    
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride("_method"));
    app.use(express.static(path.join(__dirname, "public")));

    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
      res.locals.succMsg = req.flash("success");
      res.locals.errMsg = req.flash("error");
      res.locals.currUser = req.user;
      next();
    });

    // Routes
    app.use("/listings", listingsRouter);
    app.use("/listings/:id/reviews", reviewsRouter);
    app.use("/", userRouter);

    // Error handlers
    app.all("*", (req, res, next) => {
      next(new ExpressError(404, "Page Not found!"));
    });

    app.use((err, req, res, next) => {
      let { statusCode = 500, message = "Something went wrong!" } = err;
      res.status(statusCode).render("error", { err }); // Fixed: no .ejs
    });

    app.listen(3000, () => {
      console.log("✅ Server is listening to port 3000");
    });
  })
  .catch((err) => {
    console.log("❌ DB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
