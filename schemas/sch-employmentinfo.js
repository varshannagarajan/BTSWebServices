// Set up

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const companySchema = require("./sch-company");
const addressSchema = require("./sch-address");

// Schema 

var employmentInfoSchema = new Schema({
    organization: String,
    occupation: String,
    organizationAddress: addressSchema
})

// Make schema public to the application 
module.exports = employmentInfoSchema;