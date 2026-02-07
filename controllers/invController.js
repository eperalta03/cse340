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

/* ***************************
 *  Build item view by id
 * ************************** */

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

/* ***************************
 *  Build management view
 * ************************** */

invCont.buildManagement = async function (req, res, next){
  const nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}


invCont.addNewClassification = async function (req, res){
  const {classification_name} = req.body
  
  const newClassification = await invModel.insertClassification(
    classification_name
  )
  
  if (newClassification) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `The ${classification_name} classification was succesfully added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, something went wrong")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationList,
  })
}

invCont.addNewVehicle = async function (req, res, next) {
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  
  const newVehicle = await invModel.insertInventory ( 
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color 
  )
  
  if (newVehicle) {
    const nav = await utilities.getNav()
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was succesfully added to the inventory.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, something went wrong")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
    })
  }
  
}

invCont.throwError = async (req, res, next) => {
  const err = new Error("Intentional Server Error")
  err.status = 500
  throw err
}

module.exports = invCont