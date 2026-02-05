const db = require("../config/db");

// Create new space
exports.createSpace = async (req, res) => {
  try {
    const { rows } = await db.query(
      "INSERT INTO task_schema.space DEFAULT VALUES RETURNING *",
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create space" });
  }
};

// Delete space
exports.deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query(
      "DELETE FROM task_schema.space WHERE id = $1",
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Space not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete space" });
  }
};

exports.getSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      "SELECT * FROM task_schema.space WHERE id = $1",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Space not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get space" });
  }
};
