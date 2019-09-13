var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema 

var eventDateSchema = new Schema({
    start: Date,
    end: Date
})

// Make schema public to the application 
module.exports = eventDateSchema;