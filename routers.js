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
  snippetRouter.get("/snippets/user/signup", userController.signupRender);
  snippetRouter.post("/snippets/user/signup", userController.signupValidation);

  snippetRouter.post("/snippets/user/logout", userController.logout);

  //snippet endpoint
  snippetRouter.get("/snippets/", snippetController.snippetRender);
  snippetRouter.post("/snippets/create",  snippetController.snippetPost);
  snippetRouter.get("/snippets/id/:_id",  snippetController.oneSnippet);
  snippetRouter.get("/snippets/language/", snippetController.languageSnippet);
  snippetRouter.get("/snippets/tags/", snippetController.tagSnippet);

  //api snippet endpoint
  apiRouter.get("/api/snippets/all",passport.authenticate('basic', {session: false}),  snippetController.snippetRenderAPI);

  apiRouter.post("/api/snippets/create",passport.authenticate('basic', {session: false}),  snippetController.snippetPostAPI);

  apiRouter.get("/api/snippets/id/:_id",passport.authenticate('basic', {session: false}),  snippetController.oneSnippetAPI);

  apiRouter.get("/api/snippets/language/:language",passport.authenticate('basic', {session: false}), snippetController.languageSnippetAPI);

  apiRouter.get("/api/snippets/tags/:tags",passport.authenticate('basic', {session: false}), snippetController.tagSnippetAPI);

app.use(snippetRouter);
app.use(apiRouter);
}
