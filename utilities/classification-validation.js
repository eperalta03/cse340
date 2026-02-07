const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validateClass = {}

validateClass.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .isAlpha("en-US")
            .withMessage("Classification name must contain letters only.")
            .custom(async (classification_name) => {
                const classExists = await invModel.checkExistingClassification(classification_name)
                if (classExists){
                throw new Error("Classification already exists. Please try again")
                }
            }),
    ]
}

validateClass.checkClassData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add New Registration",
            nav,
        })
        return
    }
    next()
}

validateClass.inventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Please choose a classification."),

        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide the make (at least 3 characters)."), 

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide the model (at least 3 characters)."), 

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),
            
         body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide an image path."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail path."),

        body("inv_price")
            .trim()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid positive price."),

        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 1000, max: 9999 })
            .withMessage("Please provide a valid 4-digit year."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide valid miles (0 or more)."),

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a color."),
    ]
}

validateClass.checkInventoryData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult (req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-vehicle", {
            errors,
            title: "Add New Vehicle",
            nav, 
            classification_id,
            inv_make,
            inv_model, 
            inv_description,
            inv_image,
            inv_thumbnail, 
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

module.exports = validateClass