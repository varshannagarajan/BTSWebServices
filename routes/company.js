var express = require("express");
var router = module.exports = express.Router();

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
  // Get all
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    m.companyGetAll()
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.status(500).json({ message: error });
      });
  })
  // Add new
  .post((req, res) => {
    m.companyAdd(req.body)
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.status(500).json({ message: error });
      });
  });

router
  .route("/crud/:companyID")
  // Get one
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    m.companyGetById(req.params.companyID)
      .then(data => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ message: "Resource not found" });
      });
  })
  // Edit existing
  .put((req, res) => {
    m.companyEdit(req.body)
      .then(data => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ message: "Resource not found" });
      });
  })
  // Delete item
  .delete((req, res) => {
    m.companyDelete(req.params.companyID)
      .then(() => {
        res.status(204).end();
      })
      .catch(() => {
        res.status(404).json({ message: "Resource not found" });
      });
  });
