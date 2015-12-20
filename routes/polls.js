var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('mypolls');
});

router.get('/mypolls', ensureAuthenticated, function(req, res, next) {
  res.render('mypolls');
});

router.get('/create', ensureAuthenticated, function(req, res, next) {
  res.render('create');
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
