const User = require("../models/user.js");

module.exports.renderSign= (req, res) => {
    res.render("users/signup.ejs");
    };


module.exports.signUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Registered Successfully");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/listings");
    }
  };

  module.exports.renderLogin=(req, res) => {
    res.render("users/login.ejs");
  };

  module.exports.login=async (req, res) => {
    req.flash("success", "You logged in successfully");
  let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };
  module.exports.logout=(req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Logged out successfully");
      res.redirect("/listings");
    });
  };