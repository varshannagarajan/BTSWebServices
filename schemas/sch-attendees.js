// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendeeSchema = new Schema({
    user_email: String,
    attendee_id: String
});

module.exports = attendeeSchema;
