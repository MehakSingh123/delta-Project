const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const WrapAsync = require("../utilis/WrapAsync");
const { listingschema } = require("../schema.js");
const ExpressError = require("../utilis/ExpressError");
const flash=require("connect-flash");


const {loggedin,isOwner,validateschema}=require("../loggedin.js");
// Middleware to validate schema
const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});
// INDEX ROUTE
// CREATE ROUTE
router.route("/")
.get( WrapAsync(listingcontroller.index))
.post( 
loggedin,
upload.single("listing[image]"),
validateschema ,
WrapAsync(listingcontroller.createnewlisting)
);



// NEW ROUTE
router.get("/new", loggedin,listingcontroller.rendernewform);

// SHOW ROUTE
// UPDATE ROUTE
// DELETE ROUTE
router.route("/:id")
.get( WrapAsync(listingcontroller.shownewlisting))
.put(loggedin,isOwner,upload.single("listing[image]"), validateschema, WrapAsync(listingcontroller.updatelisting))
.delete(loggedin,isOwner,WrapAsync(listingcontroller.deletelisting));



// EDIT ROUTE
router.get("/:id/edit",loggedin,isOwner, WrapAsync(listingcontroller.editlisting));







module.exports = router;
