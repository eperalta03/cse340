const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByItemId = async function (req, res, next) {
  try {
    const item_id = req.params.itemId
    const data = await invModel.getInventoryItemById(item_id)

    if (!data) {
      const err = new Error("Item not found")
      err.status = 404
      return next(err)
    }

    const item = await utilities.buildItemGrid(data)
    const nav = await utilities.getNav()

    res.render("./inventory/item", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      item,
    })
  } catch (error) {
    next(error)
  }
}

invCont.throwError = async (req, res, next) => {
  const err = new Error("Intentional Server Error")
  err.status = 500
  throw err
}


module.exports = invCont