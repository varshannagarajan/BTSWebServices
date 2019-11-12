// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendeeSchema = new Schema({
    user_email: String,
    attendee_id: String,
    user_firstName: String,
    user_lastName: String
});

module.exports = attendeeSchema;
