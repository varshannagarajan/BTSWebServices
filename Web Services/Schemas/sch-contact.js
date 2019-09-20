// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    contact_ID: Schema.Types.ObjectId,
    emails: [String],
    phoneNumber: String,
    linkedIn: String,
    facebook: String,
    twitter: String,
    instagram: String
});

module.exports = contactSchema;
