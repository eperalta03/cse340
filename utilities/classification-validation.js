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

module.exports = validateClass