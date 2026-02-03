const db = require("../config/db");

// Get all tasks in space
exports.getSpaceTasks = async (req, res) => {
  try {
    const { spaceId } = req.params;

    // Check if space with spaceId exists
    const spaceCheck = await db.query(
      "SELECT id FROM task_schema.space WHERE id = $1",
      [spaceId],
    );
    if (spaceCheck.rows.length === 0) {
      return res.status(404).json({ error: "Space not found" });
    }

    const { rows } = await db.query(
      "SELECT * FROM task_schema.task WHERE space_id = $1 ORDER BY id ASC",
      [spaceId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { content, spaceId } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const { rows } = await db.query(
      'INSERT INTO task_schema.task ("content", "space_id") VALUES ($1, $2) RETURNING *',
      [content, spaceId],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, status } = req.body;

    const { rows } = await db.query(
      `UPDATE task_schema.task SET "content" = COALESCE($1, "content"), "status" = COALESCE($2, "status") WHERE id = $3 RETURNING *`,
      [content, status, id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query(
      "DELETE FROM task_schema.task WHERE id = $1",
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
