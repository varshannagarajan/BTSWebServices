var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema 

var dateSchema = new Schema({
    start: Date,
    end: Date
})

// Make schema public to the application 
module.exports = dateSchema;