// Setup
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);

// Load the schemas
const eventSchema = require("./Schemas/sch-event.js");
const userSchema = require("./Schemas/sch-user.js");
const companySchema = require("./Schemas/sch-company.js");

module.exports = function(mongoDBConnectionString) {
  let Event; // defined on connection to the new db instance
  let User;
  let Company;

  return {
    connect: function() {
      return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString);

        db.on("error", error => {
          reject(error);
        });

        db.once("open", () => {
          Event = db.model("event", eventSchema, "event");
          User = db.model("user", userSchema, "user");
          Company = db.model("company", companySchema, "company");

          resolve();
        });
      });
    },

    /*******************************************************          EVENTS         *********************************************************************/
    eventsGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        Event.find()
          .sort({ eventId: "asc" })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    eventsGetById: function(eventId) {
      return new Promise(function(resolve, reject) {
        // Find one specific document
        Event.findById(eventId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject("Not found");
          }
        });
      });
    },

    eventsAdd: function(newItem) {
      return new Promise(function(resolve, reject) {
        Event.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      });
    },

    eventsEdit: function(newItem) {
      return new Promise(function(resolve, reject) {
        Event.findByIdAndUpdate(
          newItem.eventId,
          newItem,
          { new: true },
          (error, item) => {
            if (error) {
              // Cannot edit item
              return reject(error.message);
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              return resolve(item);
            } else {
              return reject("Not found");
            }
          }
        );
      });
    },

    eventDelete: function(eventId) {
      return new Promise(function(resolve, reject) {
        Event.findByIdAndRemove(eventId, error => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        });
      });
    },

    /*********************************************************          USER         *********************************************************************/
    eventsGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        Event.find()
          .sort({ eventId: "asc" })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    eventsGetById: function(eventId) {
      return new Promise(function(resolve, reject) {
        // Find one specific document
        Student.findById(studentId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject("Not found");
          }
        });
      });
    },

    studentAdd: function(newItem) {
      return new Promise(function(resolve, reject) {
        Student.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      });
    },

    studentEdit: function(newItem) {
      return new Promise(function(resolve, reject) {
        Student.findByIdAndUpdate(
          newItem._id,
          newItem,
          { new: true },
          (error, item) => {
            if (error) {
              // Cannot edit item
              return reject(error.message);
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              return resolve(item);
            } else {
              return reject("Not found");
            }
          }
        );
      });
    },

    studentDelete: function(itemId) {
      return new Promise(function(resolve, reject) {
        Student.findByIdAndRemove(itemId, error => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        });
      });
    },

    /*******************************************************          COMPANY         *********************************************************************/
    eventsGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        Event.find()
          .sort({ eventId: "asc" })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    eventsGetById: function(eventId) {
      return new Promise(function(resolve, reject) {
        // Find one specific document
        Student.findById(studentId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject("Not found");
          }
        });
      });
    },

    studentAdd: function(newItem) {
      return new Promise(function(resolve, reject) {
        Student.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      });
    },

    studentEdit: function(newItem) {
      return new Promise(function(resolve, reject) {
        Student.findByIdAndUpdate(
          newItem._id,
          newItem,
          { new: true },
          (error, item) => {
            if (error) {
              // Cannot edit item
              return reject(error.message);
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              return resolve(item);
            } else {
              return reject("Not found");
            }
          }
        );
      });
    },

    studentDelete: function(itemId) {
      return new Promise(function(resolve, reject) {
        Student.findByIdAndRemove(itemId, error => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        });
      });
    }
  };
};
