const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const parseurl = require('parseurl');
const routes = require('./routers');
const path = require('path');
const Snippet = require('./models/snippet');
const User = require('./models/user');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const app = express();

const mongoose = require('mongoose');

const nodeEnv = process.env.NODE_ENV || 'development';
const config = require('./config.json')[nodeEnv];
mongoose.connect(config.mongoURL);
mongoose.Promise = require('bluebird');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

app.use(bodyParser.json());
app.use((bodyParser.urlencoded({extended: false})));
app.use(express.static(path.join(__dirname, 'public')));


passport.use(new BasicStrategy(
  function(username, password, done){

    User.findOne({username: username, password: password}).then(user=>{
      if(!user){
        return done(null, false);
      } else{
        return done(null, user);
      }
    })
  }
));
app.use((req, res, next) => {
  passport.authenticate('basic', {session: false});
  next();
});
app.use(expressValidator({
  additionalValidtaors: 'equals'
}));

app.use(session({
  secret: 'flavor',
   resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next){
  var pathname = parseurl(req).pathname;
  if(!req.session.user && !pathname.includes('/snippets/user/')){
    res.redirect('/snippets/user/login');
  } else {
    next();
  }
});
routes(app);
app.get("/api/sanity", (req, res)=>{
  res.json({hello: "tim"})
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Snippet Project');
});


module.exports = app;
