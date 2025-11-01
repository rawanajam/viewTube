import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp4")) {
        res.setHeader("Content-Type", "video/mp4");
      }
    },
  })
);


// Test DB connection
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ dbTime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all public videos
app.get("/api/videos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.id,
        v.title,
        v.thumbnail,
        v.url,
        v.description,
        v.views,
        u.username AS channel
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE v.is_public = TRUE
      ORDER BY v.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get a single video by ID
app.get("/api/videos/:id", async (req, res) => {
  const { id } = req.params;
  console.log("🎥 Received video ID:", id); // 👈 Add this line for debugging

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid video ID" });
  }

  try {
    const result = await pool.query(
      `SELECT v.*, u.username AS channel 
       FROM videos v 
       JOIN users u ON v.user_id = u.id 
       WHERE v.id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Video not found" });

    const video = result.rows[0];
    video.videoUrl = `/${video.url}`; // 👈 ensures proper URL
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching video" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
