// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build item inventory by id
router.get("/item/:itemId", utilities.handleErrors(invController.buildByItemId));

router.get("/error", utilities.handleErrors(invController.throwError))


module.exports = router;