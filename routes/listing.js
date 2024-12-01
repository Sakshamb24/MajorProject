const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync1.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressErros.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");

const upload = multer({storage});


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errmess = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmess);
  } else {
    next();
  }
};

// Index Route
router.get("/", wrapAsync(listingController.index));

//New
router.get("/new", isLoggedIn, listingController.renderNew);

//show
router.get("/:id", wrapAsync(listingController.showListing));

//create router

router.post(
  "/",
  isLoggedIn,
  
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createNew)
);



//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//update router
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
);


//delete router

router.delete("/:id", isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;
