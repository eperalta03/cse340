const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const reviewCont = {}

/* ***************************
 *  Build review form
 * ************************** */
reviewCont.buildAddReviewForm = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const inv_id = req.params.itemId

    const vehicle = await invModel.getInventoryItemById(inv_id)

    if (!vehicle) {
      const err = new Error("Vehicle not found")
      err.status = 404
      return next(err)
    }

    res.render("./review/new-review", {
      title: `Add Review for ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      inv_id,
      errors: null,
      review_text: null
    })

  } catch (error) {
    next(error)
  }
}


reviewCont.addNewReview = async function (req, res, next) {
  try {
    const { review_text, review_rating, inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    const newReview = await reviewModel.insertReview(
      review_text,
      review_rating,
      inv_id,
      account_id
    )

    if (newReview) {
      req.flash("notice", "Review successfully posted.")
      return res.redirect(`/inv/item/${inv_id}`)
    }

    req.flash("notice", "Sorry, something went wrong.")
    const nav = await utilities.getNav()

    res.status(500).render("./review/new-review", {
      title: "Add New Review",
      nav,
      inv_id,
      review_text,
      errors: null
    })

  } catch (error) {
    next(error)
  }
}


module.exports = reviewCont