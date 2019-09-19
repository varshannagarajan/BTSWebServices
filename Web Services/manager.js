// Data service operations

// Setup
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load the schemas
const userSchema = require('./Schemas/sch-user');

module.exports = function (mongoDBConnectionString) {

  let UserAccounts;

  return {

    connect: function () {
      return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString);

        db.on('error', (err) => {
          reject(err);
        });

        db.once('open', () => {
          UserAccounts = db.model("useraccounts2", userSchema, "useraccounts");
          resolve();
        });
      });
    },

    usersGetAll: function () {
        return new Promise(function (resolve, reject) {
  
          UserAccounts.find()
            .exec()
            .then((users) => {
              // Found, a collection will be returned
              resolve(users);
            })
            .catch((err) => {
              reject(err);
            });
        })
      },

      userGetById: function(id) {
        return new Promise(function (resolve, reject) {
          UserAccounts.findById(id)
            .exec()
            .then((user) => {
              // Found, one object will be returned
              resolve(user);
            })
            .catch((err) => {
              // Find/match is not found
              reject(err);
            });
        })
      },

      userRegister: function (userData) {
        return new Promise(function (resolve, reject) {
      
          // Incoming data package has user name (email address), full name, 
          // two identical passwords, and a role (string)
          // { userName: xxx, fullName: aaa, password: yyy, passwordConfirm: yyy, role: zzz }
      
          if (userData.password != userData.passwordConfirm) {
            return reject("Passwords do not match");
          }
      
          // Generate a "salt" value
          var salt = bcrypt.genSaltSync(10);
          // Hash the result
          var hash = bcrypt.hashSync(userData.password, salt);
      
          // Update the incoming data
          userData.password = hash;
      
          // Create a new user account document
          let newUser = new UserAccounts(userData);
      
          // Attempt to save
          newUser.save((error) => {
            if (error) {
              if (error.code == 11000) {
                reject("User account creation - cannot create; user already exists");
              } else {
                reject(`User account creation - ${error.message}`);
              }
            } else {
              resolve("User account was created");
            }
          }); //newUser.save
        }); // return new Promise
      }, // useraccountsRegister

      userEdit: function (newUser) {
        return new Promise(function (resolve, reject) {
  
          UserAccounts.findByIdAndUpdate(newUser.user_userID, newUser, { new: true }, (error, item) => {
            if (error) {
              // Cannot edit user
              return reject(error.message);
            }
            // Check for an user
            if (user) {
              // Edited object will be returned
              return resolve(user);
            } else {
              return reject('User not found');
            }
  
          });
        })
      },

      userDelete: function(id) {
          return new Promise(function (resolve, reject) {
            UserAccounts.findByIdAndRemove(id, (error) => {
                if(error) {
                    // Cannot delete user
                    return reject(error.message);
                }
                // Return success
                return resolve();
            })
          });
      }

    }
}