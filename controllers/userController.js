// const expressValidator = require('express-validator');
const User = require('../models/user');
const bodyParser = require('body-parser');
const createUser = require('../controllers/helpers').createUser;
const createPasswordHashObject = require('../controllers/helpers').createPasswordHashObject;
const login = require('../controllers/helpers').login;



module.exports = {
  loginRender: (req, res)=>{
    res.render('login')
  },
  signupRender: (req, res)=>{
    res.render('signup')
  },
  signupValidation: (req, res)=>{

    req.checkBody('firstName', "Please fill in First Name").notEmpty()
    req.checkBody('username', "Please fill in Username").notEmpty()
    req.checkBody('password', "Please fill in password").notEmpty()
    req.checkBody('password', "Password is at least 4 characters").isLength({min:4, max:100})
    req.checkBody('confPassword', "Please fill in the Confirm Password").notEmpty()
    req.checkBody('confPassword', "Passwords do not match").equals(req.body.password);

    let errors = req.validationErrors();

    if (errors){
      req.body['errors'] = errors;
      res.render('signup', req.body);
    } else {

      let newUser = new User({username: req.body.username, password: createPasswordHashObject(req.body.password), firstName: req.body.firstName});

      newUser.save(err => {
          if (err) {
            let context = {message: "Sorry, something went wrong. Try a different username."}
            res.render('signup', context);
            return;
          }
        }).then(user=>{
          console.log(newUser);
          req.session.name = user.firstName;
          console.log(req.session.name);
          req.session.userId = user._id
          console.log(req.session.userId);
          req.session.user = user.username;
          console.log(req.session.user);

          res.redirect('/snippets/');
        })
    }
  },

  login: (req, res)=>{
let context = {}
    User.findOne({username: req.body.username}).then(user=>{
      console.log(user);
      if(!user){
        const context = {};
        context.message = "Invalid Credentials";
        res.render('login', context);
      }
      let pwObject = user.password
      let enteredPwObject = createPasswordHashObject(req.body.password, pwObject.salt);

      if (pwObject.hash !== enteredPwObject.hash) {
        context.message = "not correct";
        res.render('login', context);
      } else {
        req.session.name = user.firstName;
        req.session.userId = user._id
        req.session.user = user.username
        res.redirect("/snippets/")
      }

    });
  },
  logout: (req, res)=>{
    delete req.session.name;
    delete req.session.userId;
    delete req.session.user;
    res.redirect("/snippets/user/login")
  }
};
