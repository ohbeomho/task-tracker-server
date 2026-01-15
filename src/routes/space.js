const express = require("express");
const router = express.Router();
const spaceController = require("../controllers/space");

// Create a new space
router.post("/", spaceController.createSpace);

// Delete a space
router.delete("/:id", spaceController.deleteSpace);

module.exports = router;
