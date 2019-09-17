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