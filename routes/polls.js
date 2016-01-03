/* Required modules and model */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Poll = require('../models/poll');

/* Route for a user's polls */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('mypolls');
});

router.get('/mypolls', ensureAuthenticated, function(req, res, next) {
  var username = req.user.username;
  Poll.getPollsByUsername(username, function(err, results) {
    if (err) {
      throw err;
    } else {
      var x = results.length;
      res.render('mypolls', {"results": results, "lengthx": x});
      console.log(results);
    }
  });
});

/* Delete polls from My Polls */
router.get('/delete/:id', ensureAuthenticated, function(req, res, next) {
  var id = req.params.id;
  Poll.getSinglePoll(id, function(err, results) {
    if (err) {
      throw err;
    } else {
      results.remove();
      res.redirect('/polls/mypolls');
    }
  });
});

/* Route for create new poll page */
router.get('/create', ensureAuthenticated, function(req, res, next) {
  res.render('create');
});

/* Handles POST requests for new polls */
router.post('/create', function(req, res, next) {
  // form validation
  var question = req.body.question,
      username = req.user.username,
      options = req.body.options,

      /* above options variable is an array. The follow mutates it into an array of objects */
      choiceObj = function(choice) {
        this.choice = choice;
        this.votes = 0;
      },
      arrChoices = [];

  options.forEach(function(item) {
    var x = new choiceObj(item);
    arrChoices.push(x);
  });

  // validate the form
  req.checkBody('question', 'You cannot have a poll without a question!').notEmpty();
  req.checkBody('options', 'Fill out the options').notEmpty();

  var errors = req.validationErrors();

  // if there are validation errors, display the errors
  if (errors) {
    res.render('create', {
      errors: errors,
      question: question,
      options: options
    });
  // otherwise createa a new poll
  } else {
    var newPoll = new Poll({
    username: username,
    question: question,
    options: arrChoices
    });
  }

  /* Save new poll to DB and redirect user to new poll */
  Poll.createPoll(newPoll, function(err, poll) {
    if (err) throw err;
    req.flash('success', 'Your poll has been posted! Be the first to cast a vote.');
    res.location('/polls/show/' + poll._id);
    res.redirect('/polls/show/' + poll._id);
  });
});

/* Show all the polls. Authentication not required. */
router.get('/allpolls', function(req, res, next) {
  Poll.getAllPolls(function(err, results) {
    if (err) {
      throw err;
    } else {
      var x = results.length;
      res.render('allpolls', {"results": results, "length": x});
    }
  });
});

/* Show a specific poll. Authentication not required */
router.get('/show/:id', function(req, res, next) {
  var id = req.params.id;
  Poll.getSinglePoll(id, function(err, results) {
    if (err) {
      throw err;
    } else {
      var dataLabels = [],
          dataVotes = [],
          data = {
            labels: dataLabels,
            votes: dataVotes
          };

      results.options.forEach(function(item) {
        dataLabels.push(item.choice);
        dataVotes.push(item.votes);
      });

      res.render('show', {"results": results, "labels": dataLabels, "data": dataVotes});
    }
  });
});

/* Add user vote to DB */
router.post('/show/:id', function(req, res, next) {
  var id = req.params.id,
      userChoice = req.body.option;

  Poll.update({_id: id, "options.choice": userChoice},
              {$inc: {"options.$.votes": 1}},
              function(err, vote) {
                if (err) {
                  console.log('here is the error: ' + err);
                } else {
                  console.log('here is the vote: ' + vote);
                  res.location('/polls/show/' + id);
                  res.redirect('/polls/show/' + id);
                }
              });
});

router.get('/edit/:id', ensureAuthenticated, function(req, res, next) {
  var id = req.params.id;
  Poll.getSinglePoll(id, function(err, results) {
    if (err) {
      throw err;
    } else {
      res.render('edit', {"results": results});
    }
  });
});

router.post('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  var options = req.body.options;
  var newChoice = function(option) {
    this.choice = options;
    this.votes = 0;
  };

  var x = new newChoice(options);

    Poll.update({_id: id}, {$push: {"options": x}}, function(err, doc) {
      if (err) {
        throw err;
      } else {
        req.flash('You have added an option to the poll!');
        res.location('/polls/show/' + id);
        res.redirect('/polls/show/' + id);
      }
    });
});

/* Passport function for access control. */
function ensureAuthenticated(req, res, next) {
 if(req.isAuthenticated()) {
     return next();
 }
 req.flash('info','Please sign in or register to view this page.');
 res.redirect('/users/register');
}

module.exports = router;
