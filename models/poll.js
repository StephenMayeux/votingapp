var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/votingapp');

var PollSchema = new mongoose.Schema({
    username: String,
    question: String,
    options: Array
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {
    newPoll.save(callback);
};

module.exports.getPollsByUsername = function(username, callback) {
  var query = {username: username};
  Poll.find(query, callback);
};

module.exports.getAllPolls = function(callback) {
  Poll.find({}, {}, callback);
};

module.exports.getSinglePoll = function(id, callback) {
  Poll.findById(id, callback);
};
