import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = express();
app.use(cors());
app.use(express.json());

// Test connection
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ dbTime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Example: Get all videos
app.get("/api/videos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id,
        v.title,
        v.thumbnail AS thumbnail,
        v.views,
        u.username AS channel
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE v.is_public = TRUE
      ORDER BY v.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/videos/search", async (req, res) => {
  const searchTerm = req.query.q;

  try {
    const results = await pool.query(
      `SELECT id, title, thumbnail, views, created_at 
       FROM videos 
       WHERE LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)
       ORDER BY views DESC
       LIMIT 20`,
      [`%${searchTerm}%`]
    );
    res.json(results.rows);
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/videos/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const result = await pool.query("SELECT * FROM videos WHERE category = $1", [category]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching category videos:", err);
    res.status(500).json({ error: "Server error" });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
