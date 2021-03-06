// Setup
const upload = require('./middleware/file-upload');
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Data model and persistent store
const manager = require("./manager.js");
// This one works for localhost...

// This one works for MongoDB Atlas...
// Replace the database user name and password, and cluster name, with your own values
const m = manager(process.env.MONGODB);

// Add support for incoming JSON entities
app.use(bodyParser.json());

// Add support for CORS
app.use(cors());

// Set up Auth0 configuration
const authConfig = {
  domain: "dev-m7n5ttvf.auth0.com",
  audience: "https://btsgroup11webservices.herokuapp.com/api/"
};

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-m7n5ttvf.auth0.com/.well-known/jwks.json'
}),
audience: authConfig.audience,
issuer: `https://${authConfig.domain}/`,
algorithms: ['RS256']
});

app.use(jwtCheck);

app.get('/authorized', jwtCheck, function (req, res) {
  res.send('Secured Resource');
});

// // Passport.js components
// var jwt = require('jsonwebtoken');
// var passport = require("passport");
// var passportJWT = require("passport-jwt");

// // JSON Web Token Setup
// var ExtractJwt = passportJWT.ExtractJwt;
// var JwtStrategy = passportJWT.Strategy;

// // Configure its options
// var jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
// // IMPORTANT - this secret should be a long, unguessable string 
// // (ideally stored in a "protected storage" area on the 
// // web server, a topic that is beyond the scope of this course)
// // We suggest that you generate a random 64-character string
// // using the following online tool:
// // https://lastpass.com/generatepassword.php 
// jwtOptions.secretOrKey = 'big-long-string-from-lastpass.com/generatepassword.php';

// var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
//   console.log('payload received', jwt_payload);

//   if (jwt_payload) {
//     // The following will ensure that all routes using 
//     // passport.authenticate have a req.user._id value 
//     // that matches the request payload's _id
//     next(null, { _id: jwt_payload._id });
//   } else {
//     next(null, false);
//   }
// });

// // Activate the security system
// passport.use(strategy);
// app.use(passport.initialize());

// Deliver the app's home page to browser clients
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

/*******************************************************          EVENTS         *********************************************************************/
// Get all
app.get("/api/events", function (req, res) {
  m.eventsGetAll()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({ message: error });
    });
});

// Get one
app.get("/api/events/:eventId", function (req, res) {
  m.eventsGetById(req.params.eventId)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});

// Get event by it's event code
app.get("/api/events/eventCode/:eventCode", function (req, res) {
  m.eventsGetByCode(req.params.eventCode)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "Event by event code not found" });
    });
});


// Get all user's events
app.get("/api/events/userEvents/:username", function (req, res) {
  // Call the manager method
  m.findUsersEvents(req.params.username)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res
        .status(420)
        .json({ message: err })
        .end();
    });
});

// Add new
app.post("/api/events", function (req, res) {
  m.eventsAdd(req.body)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({ message: error });
    });
});

// Edit existing
app.put("/api/events/:eventId", function (req, res) {
  m.eventsEdit(req.body)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "Event not found" });
    });
});

// User adding another user to contact list through an attendee ID
// takes a request body in the following form: {"eventCode": "42345678", "attendeeId": "1234", "adderUserEmail": "third@gmail.com"}
// check's if event with event code given exists
// if it does then it checks all the attendees in the event and sees if the attendee id given is in the event
// if it is, then it adds the associated user to the adderUserEmail account
app.put("/api/eventsaddContactWithAttendeeID", function (req, res) {
  var foundUser = false;
  m.eventsGetByCode(req.body.eventCode)
  .then(data => {
    if(data.ev_attendees.some(attendee => {
      if(attendee.attendee_id == req.body.attendeeId) {
        foundUser = true;
        m.userAddAttendee(req.body.adderUserEmail, attendee.user_email)
        .then(newData => {
          res.json({message: newData});
        })
        .catch(msg => {
          res.status(400).json({message: msg});
        })
      } 
    }));
    if(!foundUser) {
      res.status(400).json({message : "Attendee with given attendee id was not found in the event"});
    }
  })
  .catch(msg => {
    res.status(400).json({ message: msg });
  })
});

// Add an attendee to an event
// takes a request body in the following form: {"user_email": "fifth@gmail.com", user_firstName: "Julian", user_lastName: "Boyko", "attendee_id": 2234}
// takes an event code in the params, i.e: /api/events/attendees/42345678   <--- those digits are an event code associated with an event
app.put("/api/events/attendees/:eventCode", (req, res) => {
  m.eventsAddAttendee(req.params.eventCode, req.body)
  .then(() => {
    res.json("Attendees Saved");
  })
  .catch(() => {
    res.status(404).json({ message: "Resource not found" });
  });
});

// Delete item
app.delete("/api/events/:eventId", (req, res) => {
  m.eventsDelete(req.params.eventId)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});

/*********************************************************          USER         *********************************************************************/
// ############################################################
// This code handles requests for activate, create, and login

/* Where image is the name of the property sent from angular via the Form Data and the 1 is the max number of files to upload*/
app.post('/api/users/upload-picture', upload.array('image', 1), (req, res) => {
  /* This will be the response sent from the backend to the frontend */
  res.send({ image: req.file });
 });

// User account activate
app.post("/api/users/activate", (req, res) => {
  m.userActivate(req.body)
    .then((data) => {
      res.json({ "message": data });
    }).catch((msg) => {
      res.status(400).json({ "message": msg });
    });
});

// // User account login
// app.post("/api/users/login", (req, res) => {
//   m.userLogin(req.body)
//     .then((data) => {

//       // Configure the payload with data and claims
//       var payload = {
//         _id: data._id,
//         email: data.user_email,
//       };
//       var token = jwt.sign(payload, jwtOptions.secretOrKey);
//       // Return the result
//       res.json({ "message": "Login was successful", token: token });

//     }).catch((msg) => {
//       res.status(400).json({ "message": msg });
//     });
// });

// Get all users
app.get("/api/users", (req, res) => {
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
});

// Get one user
app.get("/api/users/:userID", function (req, res) {
  // Call the manager method
  m.userGetById(req.params.userID)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(404).json({ message: "Resource not found" });
    });
});

  
// Get one user
app.get("/api/users/username/:userName", function (req, res) {
  // Call the manager method
  m.userGetByUsername(req.params.userName)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(404).json({ message: "Resource not found" });
    });
});

// User account create
app.post("/api/users", (req, res) => {
  console.log(req.body);
  m.userRegister(req.body)
    .then(data => {
      res.json({ message: data });
    })
    .catch(msg => {
      res.status(400).json({ message: msg });
    });
});

// Remove Contact from User
app.put("/api/usersdeleteContact", (req, res) =>  {
  m.userRemoveContact(req.body.emailToDelete, req.body.usersEmail)
  .then(() => {
    res.json("Contact Removed");
  })
  .catch(() => {
    res.status(404).json({ message: "Delete Contact Not Working" });
  });
});

// Add profile picture url to User
app.put("/api/users/add-profile-picture", (req, res) => {
  m.userAddProfilePicture(req.body.userEmail, req.body.pictureURL)
  .then(() => {
    console.log("Profile Picture added.");
    res.json("Profile Picture added.");
  })
  .catch(() => {
    res.status(403).json({ message: "Profile Picture could not be added." });
  })
});

// Add logo picture url to User
app.put("/api/users/add-logo-picture", (req, res) => {
  m.userAddLogoPicture(req.body.userEmail, req.body.pictureURL)
  .then(() => {
    console.log("Logo Picture added.");
    res.json("Logo Picture added.");
  })
  .catch(() => {
    res.status(403).json({ message: "Logo Picture could not be added." });
  })
});

// Edit existing user
app.put("/api/users/:userID", (req, res) => {
  m.userEdit(req.body)
    .then(data => {
      res.json({
        message:
          "update user with Id: " +
          req.params.userID +
          " to " +
          req.body.firstName +
          " " +
          req.body.lastName
      });
    })
    .catch(msg => {
      res.status(404).json({ message: msg });
    });
});

app.put("/api/users/addEvent/:eventCode", (req, res) => {
  m.eventAddedToUser(req.params.eventCode, req.body)
  .then(() => {
    res.json("Attendees Saved");
  })
  .catch(() => {
    res.status(404).json({ message: "Resource not found" });
  });
});

// Delete user
app.delete("/api/users/:userID", (req, res) => {
  // Call the manager method
  m.userDelete(req.params.userID)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});

/*******************************************************          COMPANY         *********************************************************************/

// Get all
app.get("/api/company", function (req, res) {
  m.companyGetAll()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({ message: error });
    });
});

// Get one
app.get("/api/company/:companyID", function (req, res) {
  m.companyGetById(req.params.companyID)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});

// Add new
app.post("/api/company", (req, res) => {
  m.companyAdd(req.body)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({ message: error });
    });
});

// Edit existing
app.put("/api/company/:companyID", (req, res) => {
  m.companyEdit(req.body)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});

// Delete item
app.delete("/api/company/:companyID", (req, res) => {
  m.companyDelete(req.params.companyID)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ message: "Resource not found" });
    });
});

/*****************************************************************************************************************************************************/


// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send("Resource not found");
});

m.connect().then(() => {
  app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
}).catch((err) => {
  console.log("Unable to start the server:\n" + err);
  process.exit();
});