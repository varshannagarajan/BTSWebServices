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

// User account activate
router.post("/activate", (req, res) => {
  m.userActivate(req.body)
    .then(data => {
      res.json({ message: data });
    })
    .catch(msg => {
      res.status(400).json({ message: msg });
    });
});

// User account login
router.post("/login", (req, res) => {
  m.userLogin(req.body)
    .then(data => {
      // Configure the payload with data and claims
      var payload = {
        _id: data._id,
        email: data.user_email
      };
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ message: "Login was successful", token: token });
    })
    .catch(msg => {
      res.status(400).json({ message: msg });
    });
});