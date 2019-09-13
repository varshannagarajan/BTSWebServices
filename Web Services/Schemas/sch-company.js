// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const addressSchema = require("./sch-address");
const contactSchema = require("./sch-contact");
const userSchema = require("./sch-user");
const eventSchema = require("./sch-event");

// Schema 

var companySchema = new Schema({
    comp_cid: {type: String, unique: true},
    comp_name: String,
    comp_address: addressSchema,
    comp_contact: contactSchema,
    photo: Image, 
    employees: [userSchema],
    bio: String,
    eventsList: [eventSchema]
})

// Make schema public to the application 
module.exports = companySchema;