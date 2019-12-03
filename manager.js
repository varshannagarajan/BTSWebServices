// Setup
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);

// Load the schemas
const eventSchema = require("./schemas/sch-event.js");
const userSchema = require("./schemas/sch-user.js");
const companySchema = require("./schemas/sch-company.js");

const attendeeSchema = require("./schemas/sch-attendees.js");

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

    userActivate: function(userData) {
      return new Promise(function(resolve, reject) {
        // Incoming data package has user name (email address),
        // two identical passwords, and a role (string)
        // { userName: xxx, password: yyy, passwordConfirm: yyy, role: zzz }

        if (userData.user_password != userData.user_passwordConfirm) {
          return reject("Passwords do not match");
        }

        // Generate a "salt" value
        var salt = bcrypt.genSaltSync(10);
        // Hash the result
        var hash = bcrypt.hashSync(userData.user_password, salt);

        // Attempt to update the user account
        User.findOneAndUpdate(
          { user_email: userData.user_email },
          { user_password: hash, user_statusActivated: true },
          { new: true },
          (error, item) => {
            if (error) {
              // Cannot edit item
              return reject(`User account activation - ${error.message}`);
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              //return resolve(item);
              // Alternatively...
              return resolve("User account was activated");
            } else {
              return reject("User account activation - not found");
            }
          }
        ); // UserAccounts.findOneAndUpdate
      }); // return new Promise
    }, // useraccountsActivate

    userRegister: function(userData) {
      return new Promise(function(resolve, reject) {
        // Incoming data package has user name (email address), full name,
        // two identical passwords, and a role (string)
        // { userName: xxx, fullName: aaa, password: yyy, passwordConfirm: yyy, role: zzz }

        if (userData.user_password != userData.user_passwordConfirm) {
          return reject("Passwords do not match");
        }

        // Generate a "salt" value
        var salt = bcrypt.genSaltSync(10);
        // Hash the result
        var hash = bcrypt.hashSync(userData.user_password, salt);

        // Update the incoming data
        userData.user_password = hash;

        // Create a new user account document
        let newUser = new User(userData);

        // Attempt to save
        newUser.save(error => {
          if (error) {
            if (error.code == 11000) {
              reject(
                "User account creation - cannot create; user already exists"
              );
            } else {
              reject(`User account creation - ${error.message}`);
            }
          } else {
            resolve("User account was created");
          }
        }); //newUser.save
      }); // return new Promise
    }, // useraccountsRegister

    userLogin: function(userData) {
      return new Promise(function(resolve, reject) {
        // Incoming data package has user name (email address) and password
        // { userName: xxx, password: yyy }

        User.findOne({ user_email: userData.user_email }, (error, item) => {
          if (error) {
            // Query error
            return reject(`Login - ${error.message}`);
          }
          // Check for an item
          if (item) {
            let isPasswordMatch = bcrypt.compareSync(
              userData.user_password,
              item.user_password
            );
            if (isPasswordMatch) {
              return resolve(item);
            } else {
              return reject("Login was not successful");
            }
          } else {
            return reject("Login - not found");
          }
        }); // UserAccounts.findOneAndUpdate
      }); // return new Promise
    }, // useraccountsLogin

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

    userGetByUsername: function(username) {
      
      return new Promise(function(resolve, reject) {
        User.findOne({"user_email": username})
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

    userAddAttendee: function(adderUserEmail, addingUserEmail) {
      // adderUserEmail is the user that is adding the other user
      // addingUserEmail is the user being added
      return new Promise(function(resolve, reject) {
        User.findOneAndUpdate(
          { user_email: adderUserEmail },
          { $push: { user_contacts: addingUserEmail} })
          .exec()
          .then(() => {
            resolve(addingUserEmail + " added to " + adderUserEmail + "'s contact list.");
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    userRemoveContact: function(emailToDelete, usersEmail) {
      return new Promise(function(resolve, reject) {
        User.findOneAndUpdate(
          { user_email: usersEmail },
          { $pop: { user_contacts: emailToDelete} })
          .exec()
          .then(() => {
            resolve(addingUserEmail + " remove from " + adderUserEmail + "'s contact list.");
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    eventAddedToUser: function(eventCode, adderUser) {
      return new Promise(function(resolve, reject) {
        User.findOneAndUpdate(
          { user_email: adderUser.user_email },
          { $push: { user_eventsList: eventCode} })
          .exec()
          .then(() => {
            resolve("Event added");
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    findUsersEvents: function(username) {
      return new Promise(function(resolve, reject) {
        User.findOne({"user_email": username})
          .exec()
          .then(user => {
            var userEvents = [];

            
            user.user_eventsList.forEach(element => {
              console.log(element);
              Event.findOne({ ev_code: element })
              .exec()
              .then(event => {
                // Found, one object will be returned
                userEvents.push(event);
                console.log(event);
                
              })
              .catch(err => {
                // Find/match is not found
                reject(err);
              });
            });
            //console.log(userEvents);
            // Found, one object will be returned
            resolve(userEvents);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    /*
    findUsersEvents: function(username) {
      return new Promise(function(resolve, reject) {
        User.findOne({"user_email": username})
          .exec()
          .then(user => {
            var userEvents = [];

            
            user.user_eventsList.forEach(element => {
              console.log(element);
              Event.findOne({ ev_code: element })
              .exec()
              .then(event => {
                // Found, one object will be returned
                userEvents.push(event);
                console.log(event);
                
              })
              .catch(err => {
                // Find/match is not found
                reject(err);
              });
            });
            //console.log(userEvents);
            // Found, one object will be returned
            resolve(userEvents);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    */

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

    eventsGetByCode: function(eventCode) {
      return new Promise(function(resolve, reject) {
        Event.findOne({ ev_code: eventCode })
          .exec()
          .then(event => {
            // Found, one object will be returned
            resolve(event);
          })
          .catch(err => {
            // Find/match is not found
            reject(err);
          });
      });
    },

    eventsAddAttendee: function(eventCode, attendee) {
      return new Promise(function(resolve, reject) {
        Event.findOneAndUpdate(
          { ev_code: eventCode },
          { $push: { ev_attendees: {user_email: attendee.user_email, user_firstName: attendee.user_firstName,
             user_lastName: attendee.user_lastName, attendee_id: attendee.attendee_id }} }
          )
          .exec()
          .then(() => {
            resolve("Attendee added");
          })
          .catch(err => {
            reject(err);
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
        Company.find().exec((error, items) => {
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
