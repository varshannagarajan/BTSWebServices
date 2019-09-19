// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const contactSchema = require("./sch-contact");
const employementInfoSchema = require("./sch-employmentinfo");
const eventSchema = require("./sch-event");

// Schema 

var userSchema = new Schema({
    user_ID: {type: String, unique: true},
    user_contactInfo: contactSchema,
    user_firstName: String,
    user_lastName: String,
    user_employementInfo: employementInfoSchema,
    user_photos: [Image],
    user_contacts: [userSchema],
    user_favourites: [userSchema],
    user_eventsList:[eventSchema],
    bio: String
})

// Make schema public to the application 
module.exports = userSchema;