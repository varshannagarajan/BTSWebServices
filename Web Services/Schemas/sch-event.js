// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const companySchema = require("./sch-company");
const addressSchema = require("./sch-address");
const contactSchema = require("./sch-contact");
const userSchema = require("./sch-user");
const dateSchema = require("./sch-date")

var eventSchema = new Schema({

        ev_ID: Schema.Types.ObjectId,
        ev_name: String,
        ev_address: {type: mongoose.Schema.Types.ObjectId, ref: addressSchema},
        ev_category: [String],
        ev_description: String,
        ev_company: {type: mongoose.Schema.Types.ObjectId, ref: companySchema},
        ev_contact: {type: mongoose.Schema.Types.ObjectId, ref: contactSchema},
        ev_coordinator: [{type: mongoose.Schema.Types.ObjectId, ref: userSchema}],
        ev_date: dateSchema,
        ev_attendees: {type: mongoose.Schema.Types.ObjectId, ref: userSchema},
        ev_photo: Image,
        ev_private: Boolean,
        ev_invitedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: userSchema}]

});

module.exports = eventSchema;