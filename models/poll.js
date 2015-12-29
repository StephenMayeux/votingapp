var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/votingapp');

var PollSchema = new mongoose.Schema({
    question: String,
    options: Array
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {
    newPoll.save(callback);
};
