// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const contactSchema = require("./sch-contact");
const employmentInfoSchema = require("./sch-employmentinfo");

// Schema 

var userSchema = new Schema({
    user_email: {type: String, unique: true},
    user_password: String,
    user_contactInfo: contactSchema,
    user_firstName: String,
    user_lastName: String,
    user_employementInfo: employmentInfoSchema,
    user_photos: [String],
    user_contacts: [String],
    user_favourites: [String],
    user_eventsList:[String],
    user_bio: String,
    user_statusActivated: Boolean
})

// Make schema public to the application 
module.exports = userSchema;