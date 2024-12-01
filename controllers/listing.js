const Listing = require("../models/listing");
const User = require("../models/user");
const fetch = require("node-fetch"); // Add this for geocoding with Nominatim

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/a.ejs", { allListings });
};

module.exports.renderNew = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createNew = async (req, res, next) => {
  try {
    // Geocoding with Nominatim
    const address = req.body.listing.address; // Assuming address is provided in the form
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1`;

    const response = await fetch(geocodingUrl, {
      headers: { "User-Agent": "YourAppName (your-email@example.com)" },
    });
    const data = await response.json();

    if (!data || data.length === 0) {
      req.flash("error", "Geocoding failed. Please try again.");
      return res.redirect("/listings/new");
    }

    const { lat, lon } = data[0]; // Extract latitude and longitude

    // Handle image upload
    let url = req.file?.path || "";
    let filename = req.file?.filename || "";

    // Create and save the new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = { type: "Point", coordinates: [lon, lat] }; // Save geolocation
    await newListing.save();

    req.flash("success", "New Listing created!");
    res.redirect("/listings");
  } catch (error) {
    next(error);
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }

  let orgImage = listing.image.url;
  orgImage = orgImage.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, orgImage });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Optional: Update geocoding if address changes
  if (req.body.listing.address) {
    const address = req.body.listing.address;
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1`;

    const response = await fetch(geocodingUrl, {
      headers: { "User-Agent": "YourAppName (your-email@example.com)" },
    });
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      listing.geometry = { type: "Point", coordinates: [lon, lat] }; // Update geolocation
    }
  }

  // Handle image update
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let dl = await Listing.findByIdAndDelete(id);
  console.log(dl);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
