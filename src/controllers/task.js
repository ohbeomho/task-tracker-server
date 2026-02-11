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

const updateActions = {
  create: async ({ content, spaceId }, client) => {
    try {
      if (!content) {
        throw new Error("Content is required");
      }

      const { rows } = await client.query(
        'INSERT INTO task_schema.task ("content", "space_id") VALUES ($1, $2) RETURNING *',
        [content, spaceId],
      );

      return rows[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  update: async ({ id, content, status }, client) => {
    try {
      const { rows } = await client.query(
        `UPDATE task_schema.task SET "content" = COALESCE($1, "content"), "status" = COALESCE($2, "status") WHERE id = $3 RETURNING *`,
        [content, status, id],
      );

      if (rows.length === 0) throw new Error("Task not found");

      return rows[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  delete: async ({ id }, client) => {
    try {
      const { rowCount } = await client.query(
        "DELETE FROM task_schema.task WHERE id = $1",
        [id],
      );

      if (rowCount === 0) return false;

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

exports.bulkUpdateTasks = async (req, res) => {
  const client = await db.pool.connect();

  try {
    const actions = req.body;

    if (!actions || !Array.isArray(actions))
      return res.status(400).json({ error: "Actions array is required" });

    await client.query("BEGIN");
    const results = [];
    for (let action of actions)
      results.push(await updateActions[action.type](action.payload, client));
    await client.query("COMMIT");

    res.json(results);
  } catch (err) {
    console.error(err);
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Failed to bulk update tasks" });
  } finally {
    client.release();
  }
};
