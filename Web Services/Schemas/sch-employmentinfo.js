// Set up

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const companySchema = require("./sch-company");
const addressSchema = require("./sch-address");

// Schema 

var employmentInfoSchema = new Schema({
    empID: {type: String, unqiue: true},
    organization: companySchema,
    occupation: String,
    organizationAddress: addressSchema
})

// Make schema public to the application 
module.exports = employmentInfoSchema;