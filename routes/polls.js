var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Poll = require('../models/poll');


router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('mypolls');
});

router.get('/mypolls', ensureAuthenticated, function(req, res, next) {
  var username = req.user.username;
  Poll.getPollsByUsername(username, function(err, results) {
    if (err) {
      throw err;
    } else {
      res.render('mypolls', { "results": results });
      console.log(results);
    }
  });
});



router.get('/create', ensureAuthenticated, function(req, res, next) {
  res.render('create');
  console.log('You are logged in as: ' + req.user.username);
});

router.post('/create', function(req, res, next) {
  var question = req.body.question,
      username = req.user.username,
      options = req.body.options,
      choiceObj = function(choice) {
        this.choice = choice;
        this.votes = 0;
      },
      arrChoices = [];

  options.forEach(function(item) {
    var x = new choiceObj(item);
    arrChoices.push(x);
  });

  req.checkBody('question', 'You cannot have a poll without a question!').notEmpty();
  req.checkBody('options', 'Fill out the options').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('create', {
      errors: errors,
      question: question,
      options: options
    });
  } else {
    var newPoll = new Poll({
    username: username,
    question: question,
    options: arrChoices
    });
  }

  //create Poll
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
