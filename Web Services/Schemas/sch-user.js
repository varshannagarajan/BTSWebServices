// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const contactSchema = require("./sch-contact");
const employmentInfoSchema = require("./sch-employmentinfo");
const eventSchema = require("./sch-event");



// Schema 

var userSchema = new Schema({
    user_ID: Schema.Types.ObjectId,
    user_contactInfo: contactSchema,
    user_firstName: String,
    user_lastName: String,
    user_employementInfo: {type: mongoose.Schema.Types.ObjectId, ref: employmentInfoSchema},
    user_photos: [Image],
    user_contacts: [{type: mongoose.Schema.Types.String, ref: contactSchema}],
    user_favourites: [{type: mongoose.Schema.Types.ObjectId, ref: contactSchema}],
    user_eventsList:[{type: mongoose.Schema.Types.ObjectId, ref: eventSchema}],
    user_bio: String
})

// Make schema public to the application 
module.exports = userSchema;