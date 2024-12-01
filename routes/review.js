const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync1.js");
const ExpressError = require("../utils/expressErros.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, isAuthor } = require("../middleware.js");
const review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errmess = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmess);
  } else {
    next();
  }
};

//reviews

router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

//delete reviews

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);
module.exports = router;
