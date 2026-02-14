//Needed Resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin =  async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

accountController.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/account-management", {
    title: "Account Management",
    nav, 
    errors: null,
  })
}

accountController.buildUpdateAccount = async function (req, res, next) {
  const accountId = parseInt(req.params.accountId)
  
  if (isNaN(accountId)) {
    req.flash("notice", "Invalid account ID.")
    return res.redirect("/account/")
  }

  if (accountId != res.locals.accountData.account_id) {
    req.flash("notice", "You do not have permission to edit this account.")
    return res.redirect("/account/")
  }
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(accountId)
  res.render("./account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ***************************
 *  Update Account Info
 * ************************** */
accountController.updateAccountInfo = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const account_id = res.locals.accountData.account_id

  const updateInfo = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateInfo) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    req.session.accountData = updatedAccount
    const jwt = require("jsonwebtoken")
    const accessToken = jwt.sign(
      updatedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )
    res.cookie("jwt", accessToken, { httpOnly: true })
    req.flash("notice", "Your information has been updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the information could not be updated.")
    res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ***************************
 *  Update Password
 * ************************** */
accountController.updatePassword = async function (req, res, next){
  let nav = await utilities.getNav()
  const {account_password} = req.body

  let hashedPassword 
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password.')
    return res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }

  const account_id = res.locals.accountData.account_id
  const updatedPassword = await accountModel.updatePassword(hashedPassword, account_id)

  if (updatedPassword){
    req.flash("notice", 'Your password has been succesfully updated.')
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password could not be updated.")
    res.status(500).render("account/update", {
      title: "Edit Account", 
      nav, 
      errors: null,
    })
  }
}

accountController.logout = async function (req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = accountController