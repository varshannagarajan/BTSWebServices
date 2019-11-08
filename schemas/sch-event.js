// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const addressSchema = require("./sch-address");
const contactSchema = require("./sch-contact");
const dateSchema = require("./sch-date");
const attendeeSchema = require("./sch-attendees");

var eventSchema = new Schema({
        ev_name: String,
        ev_code: String,
        ev_address: addressSchema,
        ev_category: [String],
        ev_description: String,
        ev_company: String,
        ev_contact: contactSchema,
        ev_coordinator: String,
        ev_date: dateSchema,
        ev_attendees: [attendeeSchema],
        ev_photo: String,
        ev_private: Boolean,
        ev_invitedUsers: [String]
});

module.exports = eventSchema;
