// ======== Server.js ========
import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// =================== AUTH ROUTES ===================

// --- USER SIGNUP ---
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("🧠 Signup attempt:", email);

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    // Check if the email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, "user"]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- USER LOGIN ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

// --- ADMIN LOGIN ---
app.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role='admin'",
      [email]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ message: "Admin not found" });

    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({ message: "Admin login successful", token, role: admin.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin login error" });
  }
});

// --- TEST ROUTE ---
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
        v.duration,
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

// --- LIKE / DISLIKE ROUTES ---

// Get total likes/dislikes for a video
app.get("/api/videos/:id/reactions", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS likes,
         SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
       FROM video_likes
       WHERE video_id = $1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching likes/dislikes" });
  }
});

// Add or toggle like/dislike
app.post("/api/videos/:id/reactions", async (req, res) => {
  const { id } = req.params;
  const { user_id, type } = req.body; // type = 'like' or 'dislike'

  try {
    const existing = await pool.query(
      `SELECT * FROM video_likes WHERE user_id = $1 AND video_id = $2`,
      [user_id, id]
    );

    if (existing.rows.length > 0) {
      // If same type → remove, else update
      if (existing.rows[0].type === type) {
        await pool.query(
          `DELETE FROM video_likes WHERE user_id = $1 AND video_id = $2`,
          [user_id, id]
        );
        return res.json({ message: "Reaction removed" });
      } else {
        await pool.query(
          `UPDATE video_likes SET type = $1 WHERE user_id = $2 AND video_id = $3`,
          [type, user_id, id]
        );
        return res.json({ message: "Reaction updated" });
      }
    } else {
      await pool.query(
        `INSERT INTO video_likes (user_id, video_id, type) VALUES ($1, $2, $3)`,
        [user_id, id, type]
      );
      return res.json({ message: "Reaction added" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating reaction" });
  }
});
 // --- COMMENTS ROUTES ---

// Get comments for a video
app.get("/api/videos/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.username 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.video_id = $1
       ORDER BY c.created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Add new comment
app.post("/api/videos/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO comments (user_id, video_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, id, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding comment" });
  }
});

// Like or Dislike a comment
app.post("/api/comment/like", async (req, res) => {
  const { user_id, comment_id, type } = req.body;

  try {
    // Check if the user already liked/disliked this comment
    const existing = await pool.query(
      "SELECT * FROM comment_likes WHERE user_id=$1 AND comment_id=$2",
      [user_id, comment_id]
    );

    if (existing.rows.length > 0) {
      // Update type (toggle)
      await pool.query(
        "UPDATE comment_likes SET type=$1, created_at=NOW() WHERE user_id=$2 AND comment_id=$3",
        [type, user_id, comment_id]
      );
    } else {
      // Insert new record
      await pool.query(
        "INSERT INTO comment_likes (user_id, comment_id, type, created_at) VALUES ($1, $2, $3, NOW())",
        [user_id, comment_id, type]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating like/dislike" });
  }
});

// Get like/dislike count for comments
app.get("/api/comment/likes/:comment_id", async (req, res) => {
  const { comment_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN type='like' THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN type='dislike' THEN 1 ELSE 0 END) AS dislikes
       FROM comment_likes
       WHERE comment_id=$1`,
      [comment_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching comment likes" });
  }
});

// ✅ Get videos by category
app.get("/api/videos/category/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        v.id,
        v.title,
        v.thumbnail,
        v.url,
        v.description,
        v.duration,
        v.views,
        u.username AS channel
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE v.is_public = TRUE AND v.category = $1
      ORDER BY v.created_at DESC`,
      [category]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching videos by category:", err);
    res.status(500).json({ error: "Error fetching videos by category" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
