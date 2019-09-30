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
          Event = db.model("events", eventSchema, "events");
          User = db.model("users", userSchema, "users");
          Company = db.model("companies", companySchema, "companies");
          resolve();
        });
      });
    },

    usersGetAll: function() {
      return new Promise(function(resolve, reject) {
        User.find()
          .exec()
          .then(users => {
            // Found, a collection will be returned
            resolve(users);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    userGetById: function(id) {
      return new Promise(function(resolve, reject) {
        User.findById(id)
          .exec()
          .then(user => {
            // Found, one object will be returned
            resolve(user);
          })
          .catch(err => {
            // Find/match is not found
            reject(err);
          });
      });
    },

    userRegister: function(userData) {
      return new Promise(function(resolve, reject) {
        User.create(userData, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      }); // return new Promise
    }, // useraccountsRegister

    userEdit: function(newUser) {
      return new Promise(function(resolve, reject) {
        User.findByIdAndUpdate(
          newUser._id,
          newUser,
          { new: true },
          (error, item) => {
            if (error) {
              // Cannot edit user
              return reject(error.message);
            }
            // Check for an user
            if (item) {
              // Edited object will be returned
              return resolve(item);
            } else {
              return reject("User not found");
            }
          }
        );
      });
    },

    userDelete: function(id) {
      return new Promise(function(resolve, reject) {
        User.findByIdAndRemove(id, error => {
          if (error) {
            // Cannot delete user
            return reject(error.message);
          }
          // Return success
          return resolve();
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

    eventsDelete: function(eventId) {
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

    /*******************************************************          COMPANY         *********************************************************************/
    companyGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        Company.find()
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

    companyGetById: function(comp_id) {
      return new Promise(function(resolve, reject) {
        // Find one specific document
        Company.findById(comp_id, (error, item) => {
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

    companyAdd: function(newItem) {
      return new Promise(function(resolve, reject) {
        Company.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      });
    },

    companyEdit: function(newItem) {
      return new Promise(function(resolve, reject) {
        Company.findByIdAndUpdate(
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

    companyDelete: function(itemId) {
      return new Promise(function(resolve, reject) {
        Company.findByIdAndRemove(itemId, error => {
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
