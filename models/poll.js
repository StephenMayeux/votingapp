var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/votingapp');
var db = mongoose.connection;

// user schema
var PollSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    question: {
        type: String
    },
    options: {
        type: Array,
        default: []
    }
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {
    newPoll.save(callback);
};
