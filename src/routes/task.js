const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task");

// Get all tasks from space with spaceId
router.get("/space/:spaceId", taskController.getSpaceTasks);

router.post("/bulk", taskController.bulkUpdateTasks);

module.exports = router;
