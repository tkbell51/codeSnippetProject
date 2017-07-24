// const expressValidator = require('express-validator');
const User = require('../models/user');
const bodyParser = require('body-parser');
const createUser = require('../controllers/helpers').createUser;
const createPasswordHashObject = require('../controllers/helpers').createPasswordHashObject;
const login = require('../controllers/helpers').login;



module.exports = {
  loginRender: (req, res)=>{
    res.render('user')
  },
  signupValidation: (req, res)=>{
    const firstName = req.body.firstName;
    const username = req.body.username;
    const password = req.body.password;
    const confPassword = req.body.confPassword;
    req.checkBody('firstName', "Please fill in First Name").notEmpty()
    req.checkBody('username', "Please fill in Username").notEmpty()
    req.checkBody('password', "Please fill in password").notEmpty()
    req.checkBody('password', "Password is at least 4 characters").isLength({min:4, max:100})
    req.checkBody('confPassword', "Please fill in the Confirm Password").notEmpty()
    req.checkBody('confPassword', "Passwords do not match").equals(password);

    let errors = req.validationErrors();

    if (errors){
      req.body['errors'] = errors;
      res.render('user', req.body);
    } else {

    createUser(username, password, firstName)

      .then(function (newUser){

        console.log(newUser);
        req.session.name = newUser.firstName;
        req.session.userId = newUser._id
        req.session.user = newUser.username

        res.redirect('/snipppets/');
      })
    }
  },

  login: (req, res)=>{

    login(username, password).then(user=>{
      if(!user){
        const context = {};
        context.message = "Invalid Credentials";
        res.render('user', context);
      } else {
        req.session.name = newUser.firstName;
        req.session.userId = newUser._id
        req.session.user = newUser.username
        res.redirect("/snippets/")
      }

    });
  }

};
