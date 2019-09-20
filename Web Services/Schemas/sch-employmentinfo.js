// Set up

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const companySchema = require("./sch-company");
const addressSchema = require("./sch-address");

// Schema 

var employmentInfoSchema = new Schema({
    emp_ID: Schema.Types.ObjectId,
    organization: {type: mongoose.Schema.Types.ObjectId, ref: companySchema},
    occupation: String,
    organizationAddress: {type: mongoose.Schema.Types.ObjectId, ref: addressSchema}
})

// Make schema public to the application 
module.exports = employmentInfoSchema;