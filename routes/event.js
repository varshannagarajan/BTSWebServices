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
  // Get all
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    m.eventsGetAll()
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.status(500).json({ message: error });
      });
  })
  // Add new
  .post((req, res) => {
    m.eventsAdd(req.body)
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.status(500).json({ message: error });
      });
  });
  
router
  .route("/crud/:eventId")
  // Get one
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    m.eventsGetById(req.params.eventId)
      .then(data => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ message: "Resource not found" });
      });
  })
  // Edit existing
  .put((req, res) => {
    m.eventsEdit(req.body)
      .then(data => {
        res.json(data);
      })
      .catch(() => {
        res.status(404).json({ message: "Event not found" });
      });
  })
  // Delete item
  .delete((req, res) => {
    m.eventsDelete(req.params.eventId)
      .then(() => {
        res.status(204).end();
      })
      .catch(() => {
        res.status(404).json({ message: "Resource not found" });
      });
  });

// Get event by it's event code
router.get("/eventCode/:eventCode", passport.authenticate("jwt", { session: false }), (req, res) => {
  m.eventsGetByCode(req.params.eventCode)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "Event by event code not found" });
    });
});

// Get all user's events
router.get("/userEvents/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
  // Call the manager method
  m.findUsersEvents(req.params.username)
    .then(data => {
      console.log("LMAOOOOOO");
      console.log(data);
      res.json(data);
    })
    .catch(err => {
      res
        .status(420)
        .json({ message: err })
        .end();
    });
});

// User adding another user to contact list through an attendee ID
// takes a request body in the following form: {"eventCode": "42345678", "attendeeId": "1234", "adderUserEmail": "third@gmail.com"}
// check's if event with event code given exists
// if it does then it checks all the attendees in the event and sees if the attendee id given is in the event
// if it is, then it adds the associated user to the adderUserEmail account
router.put("/addContactWithAttendeeID", passport.authenticate("jwt", { session: false }), (req, res) => {
  var foundUser = false;
  m.eventsGetByCode(req.body.eventCode)
    .then(data => {
      if (
        data.ev_attendees.some(attendee => {
          if (attendee.attendee_id == req.body.attendeeId) {
            foundUser = true;
            m.userAddAttendee(req.body.adderUserEmail, attendee.user_email)
              .then(newData => {
                res.json({ message: newData });
              })
              .catch(msg => {
                res.status(400).json({ message: msg });
              });
          }
        })
      );
      if (!foundUser) {
        res.status(400).json({ message: "Attendee with given attendee id was not found in the event" });
      }
    })
    .catch(msg => {
      res.status(400).json({ message: msg });
    });
});

// Add an attendee to an event
// takes a request body in the following form: {"user_email": "fifth@gmail.com", user_firstName: "Julian", user_lastName: "Boyko", "attendee_id": 2234}
// takes an event code in the params, i.e: /api/events/attendees/42345678   <--- those digits are an event code associated with an event
router.put("/attendees/:eventCode", passport.authenticate("jwt", { session: false }), (req, res) => {
  m.eventsAddAttendee(req.params.eventCode, req.body)
    .then(() => {
      res.json("Attendees Saved");
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});
