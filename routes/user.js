const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../utilis/WrapAsync");
let passport=require("passport");
const {saveredirecturl}=require("../loggedin.js");
const listingcontroller=require("../controllers/users.js");
router.route("/signup")
.get(listingcontroller.rendersignupform)
.post(WrapAsync(listingcontroller.signup));
router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(saveredirecturl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),listingcontroller.login);
router.get("/logout",listingcontroller.logout);
module.exports=router;