var mongoose = require('mongoose');
var bcrypt = require("bcrypt");
//var db = mongoose.createConnection('mongodb://localhost/votingapp');
mongoose.connect('mongodb://stephen:monkeydick@ds033915.mongolab.com:33915/votingapp');
var db = mongoose.connection;

// user schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
     if (err) return callback(err);
     callback(null, isMatch);
  });
};

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  var query = {username: username};
  User.findOne(query, callback);
};


module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if (err) throw err;
        // set hashed password
        newUser.password = hash;
        // create user
        newUser.save(callback);
    });
};
