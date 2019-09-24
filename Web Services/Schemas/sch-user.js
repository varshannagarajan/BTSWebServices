// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const contactSchema = require("./sch-contact");
const employmentInfoSchema = require("./sch-employmentinfo");
const eventSchema = require("./sch-event");



// Schema 

var userSchema = new Schema({
    user_password: String,
    user_contactInfo: contactSchema,
    user_firstName: String,
    user_lastName: String,
    user_employementInfo: employmentInfoSchema,
    user_photos: [String],
    user_contacts: [String],
    user_favourites: [String],
    user_eventsList:[String],
    user_bio: String
})

// Make schema public to the application 
module.exports = userSchema;