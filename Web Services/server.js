// Setup
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Data model and persistent store
const manager = require("./manager.js");
// This one works for localhost...
//const m = manager("mongodb://localhost/assign2db");
// This one works for MongoDB Atlas...
// Replace the database user name and password, and cluster name, with your own values
const m = manager("mongodb+srv://link");

// Add support for incoming JSON entities
app.use(bodyParser.json());

// Add support for CORS
app.use(cors());

// Passport.js components
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

// JSON Web Token Setup
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Configure its options
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
// IMPORTANT - this secret should be a long, unguessable string 
// (ideally stored in a "protected storage" area on the 
// web server, a topic that is beyond the scope of this course)
// We suggest that you generate a random 64-character string
// using the following online tool:
// https://lastpass.com/generatepassword.php 
jwtOptions.secretOrKey = 'big-long-string-from-lastpass.com/generatepassword.php';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);

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
app.use(passport.initialize());

// Deliver the app's home page to browser clients
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// Tell the app to start listening for requests
app.listen(HTTP_PORT, () => {
    console.log("Ready to handle requests on port " + HTTP_PORT);
});

/*******************************************************          EVENTS         *********************************************************************/

// Get all
app.get("/api/items", (req, res) => {
    res.json({message: "fetch all items"});
});

// Get one
app.get("/api/items/:itemId", (req, res) => {
    res.json({message: "get user with Id: " + req.params.itemId});
});

// Add new
app.post("/api/items", (req, res) => {
     res.json({message: "add a user item: " + req.body.firstName + " " + req.body.lastName});
});

// Edit existing
app.put("/api/items/:itemId", (req, res) => {
    res.json({message: "update user with Id: " + req.params.itemId + " to " + req.body.firstName + " " + req.body.lastName});
});

// Delete item
app.delete("/api/items/:itemId", (req, res) => {
     res.json({message: "delete user with Id: " + req.params.itemId});
});

/*********************************************************          USER         *********************************************************************/

// Get all users
app.get("/api/useraccounts", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the manager method
    m.usersGetAll().then((data) => {
      res.json(data);
    })
      .catch((err) => {
        res.status(500).json({ "message": err }).end();
      })
});

// Get one user
app.get("/api/useraccounts/:userID", passport.authenticate('jwt', { session: false }), (req, res) => {
    // Call the manager method
    m.userGetById(req.params.userID).then((data) => {
      res.json(data);
    })
      .catch((err) => {
        res.status(404).json({ "message": "Resource not found" });
      })
  });

// Add new
app.post("/api/items", (req, res) => {
     res.json({message: "add a user item: " + req.body.firstName + " " + req.body.lastName});
});

// Edit existing
app.put("/api/items/:itemId", (req, res) => {
    res.json({message: "update user with Id: " + req.params.itemId + " to " + req.body.firstName + " " + req.body.lastName});
});

// Delete user
app.delete("/api/useraccounts/:userID", (req, res) => {
    // Call the manager method
    m.userDelete(req.params.userID)
      .then(() => {
        res.status(204).end();
      })
      .catch(() => {
        res.status(404).json({ "message": "Resource not found" });
      })
});

/*******************************************************          COMPANY         *********************************************************************/

// Get all
app.get("/api/items", (req, res) => {
    res.json({message: "fetch all items"});
});

// Get one
app.get("/api/items/:itemId", (req, res) => {
    res.json({message: "get user with Id: " + req.params.itemId});
});

// Add new
app.post("/api/items", (req, res) => {
     res.json({message: "add a user item: " + req.body.firstName + " " + req.body.lastName});
});

// Edit existing
app.put("/api/items/:itemId", (req, res) => {
    res.json({message: "update user with Id: " + req.params.itemId + " to " + req.body.firstName + " " + req.body.lastName});
});

// Delete item
app.delete("/api/items/:itemId", (req, res) => {
     res.json({message: "delete user with Id: " + req.params.itemId});
});

/*****************************************************************************************************************************************************/