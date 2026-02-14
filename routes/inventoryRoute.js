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

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildUpdateView))

router.post("/update/",
    classValidate.inventoryRules(),
    classValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inventory_id", utilities.handleErrors(invController.buildDeleteView))

router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

router.get("/error", utilities.handleErrors(invController.throwError))

module.exports = router;