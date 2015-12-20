var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://stephen:monkeydick@ds033915.mongolab.com:33915/votingapp');
/*mongoose.connect('mongodb://localhost/votingapp');
var db = mongoose.connection;*/

// user schema
var PollSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    question: {
        type: String
    },
    option1: {
      type: String
    },
    option2: {
      type: String
    }
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {
    newPoll.save(callback);
};
