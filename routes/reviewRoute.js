const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const reviewController = require("../controllers/reviewController")

router.get("/new-review/:itemId",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildAddReviewForm)
);

router.post(
    "/new-review/",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.addNewReview)
)

module.exports = router