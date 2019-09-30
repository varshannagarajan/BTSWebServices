// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const companySchema = require("./sch-company");
const addressSchema = require("./sch-address");
const contactSchema = require("./sch-contact");
const userSchema = require("./sch-user");
const dateSchema = require("./sch-date")

var eventSchema = new Schema({
        ev_name: String,
        ev_address: addressSchema,
        ev_category: [String],
        ev_description: String,
        ev_company: String,
        ev_contact: contactSchema,
        ev_coordinator: String,
        ev_date: dateSchema,
        ev_attendees: [String],
        ev_photo: String,
        ev_private: Boolean,
        ev_invitedUsers: [String]

});

module.exports = eventSchema;
