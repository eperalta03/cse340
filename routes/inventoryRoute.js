// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require('../utilities/classification-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build item inventory by id
router.get("/item/:itemId", utilities.handleErrors(invController.buildByItemId));

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post(
    "/add-classification", 
    classValidate.classificationRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addNewClassification)
)

router.post(
    "/add-inventory",
    classValidate.inventoryRules(),
    classValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewVehicle)
)

router.get("/error", utilities.handleErrors(invController.throwError))


module.exports = router;