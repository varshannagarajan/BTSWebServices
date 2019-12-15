var express = require("express");
var router = express.Router();
const manager = require("../manager.js");
const m = manager(
  "mongodb+srv://btsUser:JulianVarshanNeil1@btsproject-3qsjm.mongodb.net/btsproject?retryWrites=true&w=majority"
);
router
  .route("/")
  // Get all
  .get((req, res) => {
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
  .route("/:companyID")
  // Get one
  .get((req, res) => {
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

module.exports = router;
