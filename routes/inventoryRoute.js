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

router.get("/", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement));

router.get("/add-classification",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification));

router.get("/add-inventory", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory));

router.post(
    "/add-classification", 
    utilities.checkAccountType,
    classValidate.classificationRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addNewClassification)
)

router.post(
    "/add-inventory",
    utilities.checkAccountType,
    classValidate.inventoryRules(),
    classValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewVehicle)
)

router.get("/getInventory/:classification_id", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON))


router.get("/edit/:inventory_id", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildUpdateView))

router.post("/update/",
    utilities.checkAccountType,
    classValidate.inventoryRules(),
    classValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inventory_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteView))

router.post("/delete/", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory))

router.get("/error", utilities.handleErrors(invController.throwError))

module.exports = router;