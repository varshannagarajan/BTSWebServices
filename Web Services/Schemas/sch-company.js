// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const addressSchema = require("./sch-address");
const contactSchema = require("./sch-contact");
const userSchema = require("./sch-user");
const eventSchema = require("./sch-event");

// Schema 

var companySchema = new Schema({
    comp_ID: Schema.Types.ObjectId,
    comp_name: String,
    comp_address: {type: mongoose.Schema.Types.ObjectId, ref: addressSchema},
    comp_contact: {type: mongoose.Schema.Types.ObjectId, ref: contactSchema},
    comp_photo: Image, 
    comp_employees: [{type: mongoose.Schema.Types.ObjectId, ref: userSchema}],
    comp_bio: String,
    comp_eventsList: [{type: mongoose.Schema.Types.ObjectId, ref: eventSchema}]
})

// Make schema public to the application 
module.exports = companySchema;