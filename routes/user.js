var express = require("express");
var router = (module.exports = express.Router());

// Data model and persistent store
const manager = require("../manager.js");
const m = manager(
  "mongodb+srv://btsUser:JulianVarshanNeil1@btsproject-3qsjm.mongodb.net/btsproject?retryWrites=true&w=majority"
);
// Passport.js components
var jwt = require("jsonwebtoken");
var passport = require("passport");
var passportJWT = require("passport-jwt");

// JSON Web Token Setup
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Configure its options
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = "big-long-string-from-lastpass.com/generatepassword.php";

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log("payload received", jwt_payload);
  if (jwt_payload) {
    // The following will ensure that all routes using
    // passport.authenticate have a req.user._id value
    // that matches the request payload's _id
    next(null, { _id: jwt_payload._id });
  } else {
    next(null, false);
  }
});

// Activate the security system
passport.use(strategy);
router.use(passport.initialize());

router
  .route("/")
  // Get all users
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    // Call the manager method
    m.usersGetAll()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: err })
          .end();
      });
  })
  // User account create
  .post((req, res) => {
    m.userRegister(req.body)
      .then(data => {
        res.json({ message: data });
      })
      .catch(msg => {
        res.status(400).json({ message: msg });
      });
  });

router
  .route("/crud/:userID")
  // Get one user
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    // Call the manager method
    m.userGetById(req.params.userID)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(404).json({ message: "Resource not found" });
      });
  })
  // Edit existing user
  .put((req, res) => {
    m.userEdit(req.body)
      .then(data => {
        res.json({
          message: "update user with Id: " + req.params.userID + " to " + req.body.firstName + " " + req.body.lastName
        });
      })
      .catch(msg => {
        res.status(404).json({ message: msg });
      });
  })
  // Delete user
  .delete((req, res) => {
    // Call the manager method
    m.userDelete(req.params.userID)
      .then(() => {
        res.status(204).end();
      })
      .catch(() => {
        res.status(404).json({ message: "Resource not found" });
      });
  });

// Get one user
router.get("/username/:userName", passport.authenticate("jwt", { session: false }), (req, res) => {
  // Call the manager method
  m.userGetByUsername(req.params.userName)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(404).json({ message: "Resource not found" });
    });
});

// Remove Contact from User
router.put("/deleteContact", (req, res) => {
  m.userRemoveContact(req.body.emailToDelete, req.body.usersEmail)
    .then(() => {
      console.log("Contact Removed");
      res.json("Contact Removed");
    })
    .catch(() => {
      res.status(404).json({ message: "Delete Contact Not Working" });
    });
});

router.put("/addEvent/:eventCode", (req, res) => {
  m.eventAddedToUser(req.params.eventCode, req.body)
    .then(() => {
      res.json("Attendees Saved");
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});
