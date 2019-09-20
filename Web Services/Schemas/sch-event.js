// Set up 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const companySchema = require("./sch-company");
const addressSchema = require("./sch-address");
const contactSchema = require("./sch-contact");
const userSchema = require("./sch-user");
const dateSchema = require("./sch-date")

var eventSchema = new Schema({

        ev_ID: {type: String, unique: true},
        ev_name: String,
        ev_address: addressSchema,
        ev_category: [String],
        ev_description: String,
        ev_company: companySchema,
        ev_contact: contactSchema,
        ev_coordinator: [userSchema],
        ev_date: dateSchema,
        ev_attendees: userSchema,
        ev_photo: Image,
        ev_private: Boolean,
        ev_invitedUsers: [userSchema]

});

module.exports = eventSchema;