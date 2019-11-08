// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const addressSchema = require("./sch-address");
const contactSchema = require("./sch-contact");

// Schema 

var companySchema = new Schema({
    comp_name: String,
    comp_address: addressSchema,
    comp_contact: contactSchema,
    comp_photo: String, 
    comp_employees: [String],
    comp_bio: String,
    comp_eventsList: [String]
})

// Make schema public to the application 
module.exports = companySchema;
