const User = require("../models/user");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle signup logic
module.exports.signupForm = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Log the user in after signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            const redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle login logic (passport middleware does authentication before this runs)
module.exports.loginForm = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
