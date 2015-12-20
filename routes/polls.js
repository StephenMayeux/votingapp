var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Poll = require('../models/poll');

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('mypolls');
});

router.get('/mypolls', ensureAuthenticated, function(req, res, next) {
  res.render('mypolls');
});

router.get('/create', ensureAuthenticated, function(req, res, next) {
  res.render('create');
});

router.post('/create', function(req, res, next) {
  var question = req.body.question,
      option1 = req.body.option1,
      option2 = req.body.option2;

  req.checkBody('question', 'You cannot have a poll without a question!').notEmpty();
  req.checkBody('option1', 'You need at least 2 options. Complete option 1').notEmpty();
  req.checkBody('option2', 'You need at least 2 options. Complete option 2').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('create', {
      errors: errors,
      question: question,
      option1: option1,
      option2: option2
    });
  } else {
    var newPoll = new Poll({
      question: question,
      option1: option1,
      option2: option2
    });
  }

  // create user
  Poll.createPoll(newPoll, function(err, poll) {
    if (err) throw err;
    console.log(poll);
  });

  req.flash('success', 'Your poll has been posted!');
  res.location('/');
  res.redirect('/');
});

router.get('/allpolls', function(req, res, next) {
  res.render('allpolls');
});

router.get('/show', function(req, res, next) {
  res.render('show');
});

function ensureAuthenticated(req, res, next) {
 if(req.isAuthenticated()) { // from the passport api
     return next();
 }
 res.redirect('/users/register');
}

module.exports = router;
