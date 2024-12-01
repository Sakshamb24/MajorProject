const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync1 = require("../utils/wrapAsync1");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});



router.get("/signup",userController.renderSign);

router.post(
  "/signup",
  wrapAsync1(userController.signUp)
);

router.get("/login", userController.renderLogin);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
