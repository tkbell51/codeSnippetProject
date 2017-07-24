const parseurl = require('parseurl');
const passport = require('passport');
const express = require('express');
const userController = require('./controllers/userController');
const snippetController = require('./controllers/snippetController');

module.exports = (app) =>{
  const apiRouter = express.Router();
  const snippetRouter = express.Router();
  //login endpoint
  snippetRouter.get("/snippets/user/login", userController.loginRender);
  snippetRouter.post("/snippets/user/login", userController.login);
  snippetRouter.post("/snippets/user/signupValidation");

  //api snippet endpoint
  apiRouter.get("/api/snippets/", passport.authenticate('basic', {session: false}), snippetController.apiSnippetRender);
  apiRouter.post("/api/snippets/", passport.authenticate('basic', {session: false}), snippetController.apiSnippetPost);
  apiRouter.get("/api/snippets/:id", passport.authenticate('basic', {session: false}), snippetController.apiOneSnippet);

}
