// Setup
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const account = require("./routes/account")
const user = require("./routes/user");
const event = require("./routes/event");
const company = require("./routes/company");

const HTTP_PORT = process.env.PORT || 8080;
const app = express();

// Add support for incoming JSON entities
app.use(bodyParser.json());

// Add support for CORS
app.use(cors());

// Deliver the app's home page to browser clients
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/api/accounts", account);
app.use("/api/users", user);
app.use("/api/events", event);
app.use("/api/company", company);

// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send("Resource not found");
});

m.connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Ready to handle requests on port " + HTTP_PORT);
    });
  })
  .catch(err => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
