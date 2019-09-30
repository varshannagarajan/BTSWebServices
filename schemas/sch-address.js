// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema 

var addressSchema = new Schema({
    street: String,
    postalCode: String,
    city: String,
    province: String,
    country: String
})

// Make schema public to the application 
module.exports = addressSchema;