const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURl } = require("../middleware.js");

const userController = require("../controller/users.js");


router.route("/signup")
.get( userController.rendeSingupForm)
.post(wrapAsync(userController.signup));


router.route("/login")
.get( userController.renderLoginForm)
.post(saveRedirectURl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
userController.login);


//  logout user route
router.get("/logout", userController.logout );

module.exports = router;
