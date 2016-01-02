var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', passport.authenticate('local', {failureRedirect: '/users/register', failureFlash: 'Invalid Username or Password'}), function(req, res) {
  console.log('Authentication successful');
  req.flash('success', 'You are logged in');
  res.redirect('/polls/mypolls');
});

module.exports = router;
