// Setup
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Data model and persistent store
const manager = require("./manager.js");
// This one works for localhost...
//const m = manager("mongodb://localhost/coursedbweek2");
// This one works for MongoDB Atlas...
// Replace the database user name and password, and cluster name, with your own values
const m = manager("mongodb://Kayaba:lmao@bti-as01-shard-00-00-gmim2.mongodb.net:27017,bti-as01-shard-00-01-gmim2.mongodb.net:27017,bti-as01-shard-00-02-gmim2.mongodb.net:27017/Assignment2?ssl=true&replicaSet=BTI-AS01-shard-0&authSource=admin&retryWrites=true");

// Add support for incoming JSON entities
app.use(bodyParser.json());

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
app.get("/api/events", (req, res) => {
    m.eventsGetAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Get one
app.get("/api/events/:eventId", (req, res) => {
    m.eventsGetById(req.params.eventId)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Add new
app.post("/api/events", (req, res) => {
    m.eventsAdd(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// Edit existing
app.put("/api/events/:eventId", (req, res) => {
    m.eventsEdit(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Delete item
app.delete("/api/events/:eventId", (req, res) => {
    m.eventsDelete(req.params.eventId)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

/*********************************************************          USER         *********************************************************************/

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