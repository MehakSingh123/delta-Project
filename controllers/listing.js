const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req, res) => {
    const all_listings = await Listing.find({});
    res.render("listings/index", { all_listings });
};
module.exports.rendernewform=(req, res) => {
    res.render("listings/new");
};
module.exports.shownewlisting=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // if (!listing) {
    //     return next(new ExpressError(404, "Listing Not Found"));
    // }
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}
module.exports.createnewlisting=async (req, res) => {
   let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
      


    let url=req.file.path;
    let filename=req.file.filename;
     console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedlisting=await newListing.save();
    console.log(savedlisting);
    req.flash("success","New listing added");
    res.redirect("/listings");
};
module.exports.editlisting=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    // if (!listing) {
    //     return next(new ExpressError(404, "Listing Not Found"));
    // }
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_125");
    res.render("listings/edit", { listing, originalImageUrl });
    
    
};
// module.exports.updatelisting=async (req, res, next) => {
//     const { id } = req.params;
//     const updateData = req.body.listing;
//     // if (!updateData) {
//     //     return next(new ExpressError(400, "Send valid data for listing"));
//     // }
//     let listing=await Listing.findByIdAndUpdate(id, updateData);
//     if(typeof req.file!="undefined"){
//         let url=req.file.path;
//         let filename=req.file.filename;
//         listing.image={url,filename};
//         await listing.save();
//     };
//     req.flash("success","Listing Updated!!");
//     res.redirect(`/listings/${id}`);
// };
module.exports.updatelisting=async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body.listing;
    // if (!updateData) {
    //     return next(new ExpressError(400, "Send valid data for listing"));
    // }
    let response = await geocodingClient
    .forwardGeocode({
      query: updateData.location,
      limit: 1,
    })
    .send();

  updateData.geometry = response.body.features[0].geometry;
    let listing=await Listing.findByIdAndUpdate(id, updateData);
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    };
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};
module.exports.deletelisting=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing has deleted");
    res.redirect("/listings");
}