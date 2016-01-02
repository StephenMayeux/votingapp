/* Required Modules and Mongoose Model */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Show the Registration Page */
router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Sign Up'
  });
});

/* Create a new user */
router.post('/register', function(req, res, next) {
  // Validate the for before registering
  var name = req.body.name,
      email = req.body.email,
      username = req.body.username,
      password = req.body.password,
      password2 = req.body.password2;

  // form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'passwords do not match').equals(req.body.password);

  //check for errors
  var errors = req.validationErrors();

  // if there are validation errors, display the errors
  if (errors) {
      res.render('register', {
        errors: errors,
        name: name,
        email: email,
        username: username,
        password: password,
        password2: password2
      });
    // if there are no errors, create new user with User Model
    } else {
      var newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
      });
    }

  // Save the new user to the database
  User.createUser(newUser, function(err, user) {
    if (err) throw err;
    console.log(user);

    // automatically log new user in
    req.login(user, function(err) {
      if (err) { return next(err); }
      req.flash('success', 'You are now registered!');
      return res.redirect('/polls/mypolls');
    });
  });
});

/* Passport functions. Don't touch these */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        console.log('This user does not exit. Please register.');
        return done(null, false, {message: 'This user does not exit. Please register.'});
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Invalid password or username.');
          return done(null, false, {message: 'Invalid password or username. Please try again.'});
        }
      });
    });
}));

/* Logout the current user */
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
