// ======== Server.js ========
import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder must exist
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage2 });


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
      user_id: user.id,
      username: user.username,
      avatar: user.avatar || null ,
      created_at: user.created_at
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

    res.json({ message: "Login successful", token, role: user.role ,user_id: user.id, username: user.username,avatar: user.avatar || null ,created_at: user.created_at, channel_id:user.channel_id});
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
      SELECT v.id, v.title, v.thumbnail, v.views, v.created_at, v.duration,
             c.name AS channel
      FROM videos v
      LEFT JOIN channels c ON v.channel_id = c.id
      ORDER BY v.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ====== PUT SEARCH ROUTE FIRST ======
app.get("/api/videos/search", async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) return res.json([]);

  try {
    const results = await pool.query(
      `SELECT v.id, v.title, v.thumbnail, v.views, v.created_at, v.duration,
              c.name AS channel
       FROM videos v
       LEFT JOIN channels c ON v.channel_id = c.id
       WHERE LOWER(v.title) LIKE LOWER($1)
          OR LOWER(c.name) LIKE LOWER($1)
       ORDER BY v.created_at DESC`,
      [`%${searchTerm}%`]
    );

    res.json(results.rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get a single video by ID
app.get("/api/videos/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId; // <-- make sure this matches frontend

  if (!id || isNaN(id)) return res.status(400).json({ error: "Invalid video ID" });

  try {
    const result = await pool.query(
      `SELECT v.*, c.name AS channel 
       FROM videos v 
       JOIN channels c ON v.channel_id = c.id
       WHERE v.id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Video not found" });

    const video = result.rows[0];
    video.videoUrl = video.url ? `/${video.url}` : ""; // <-- safety check

    // Only insert history if userId exists
    if (userId) {
      try {
                await pool.query(
          `INSERT INTO history (user_id, video_id, watched_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (user_id, video_id)
          DO UPDATE SET watched_at = NOW()`,
          [userId, id]
        );

      } catch (historyErr) {
        console.error("Error inserting history:", historyErr);
        // do NOT throw, just log it
      }
    }

    res.json(video);
  } catch (err) {
    console.error("Error fetching video:", err);
    res.status(500).json({ error: "Error fetching video" });
  }
});

// --- LIKE / DISLIKE ROUTES ---

// Get total likes/dislikes for a video
app.get("/api/videos/:id/reactions", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) FILTER (WHERE type = 'like') AS likes,
         COUNT(*) FILTER (WHERE type = 'dislike') AS dislikes
       FROM video_likes
       WHERE video_id = $1`,
      [id]
    );

    const userReaction = await pool.query(
      "SELECT type FROM video_likes WHERE video_id = $1 AND user_id = $2",
      [id, user_id]
    );

    res.json({
      likes: Number(result.rows[0].likes),
      dislikes: Number(result.rows[0].dislikes),
      userReaction: userReaction.rows[0]?.type || null,
    });
  } catch (err) {
    console.error("❌ Error fetching reactions:", err);
    res.status(500).json({ error: "Error fetching reactions" });
  }
});


// Add or toggle like/dislike
// Add or toggle like/dislike
app.post("/api/videos/:id/reaction", async (req, res) => {
  const { id } = req.params; // video_id
  const { user_id, type } = req.body; // type = 'like' or 'dislike'

  try {
    const existing = await pool.query(
      "SELECT * FROM video_likes WHERE user_id = $1 AND video_id = $2",
      [user_id, id]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].type === type) {
        // same reaction again → remove it
        await pool.query("DELETE FROM video_likes WHERE user_id = $1 AND video_id = $2", [user_id, id]);
        return res.json({ removed: true });
      } else {
        // switch like ↔ dislike
        await pool.query(
          "UPDATE video_likes SET type = $1 WHERE user_id = $2 AND video_id = $3",
          [type, user_id, id]
        );
      }
    } else {
      // new reaction
      await pool.query(
        "INSERT INTO video_likes (user_id, video_id, type) VALUES ($1, $2, $3)",
        [user_id, id, type]
      );

      // ✅ Send notification only for likes
      if (type === "like") {
        // 1️⃣ Find the video owner (the uploader)
        const videoResult = await pool.query(
          "SELECT user_id FROM videos WHERE id = $1",
          [id]
        );
        const targetUserId = videoResult.rows[0]?.user_id;

        if (targetUserId && targetUserId !== user_id) {
          // 2️⃣ Get liker’s username
          const userResult = await pool.query(
            "SELECT username FROM users WHERE id = $1",
            [user_id]
          );
          const username = userResult.rows[0]?.username || "Someone";

          // 3️⃣ Insert notification
          await pool.query(
            "INSERT INTO notifications (user_id, message) VALUES ($1, $2)",
            [targetUserId, `${username} liked your video`]
          );
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error setting reaction:", err);
    res.status(500).json({ error: "Error setting reaction" });
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
// GET /api/comment/reaction/:commentId/:userId
app.get("/api/comment/reaction/:commentId/:userId", async (req, res) => {
  const { commentId, userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT type FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
      [commentId, userId]
    );
    if (result.rows.length > 0) {
      res.json({ reaction: result.rows[0].type }); // 'like' or 'dislike'
    } else {
      res.json({ reaction: null });
    }
  } catch (err) {
    console.error("Error fetching comment reaction:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Get videos by category
app.get("/api/videos/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const result = await pool.query(`
      SELECT v.id, v.title, v.thumbnail, v.views, v.created_at, v.duration,
             c.name AS channel
      FROM videos v
      LEFT JOIN channels c ON v.channel_id = c.id
      WHERE v.category = $1
      ORDER BY v.created_at DESC
    `, [category]);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching videos by category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// =================== LIKED VIDEOS ROUTE ===================
app.get("/api/likes/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
          v.id, 
          v.title, 
          v.thumbnail, 
          v.duration, 
          v.views, 
          v.created_at,
          c.name AS channel
       FROM video_likes l
       JOIN videos v ON l.video_id = v.id
       JOIN channels c ON v.channel_id = c.id
       WHERE l.user_id = $1 AND LOWER(l.type) = 'like'
       ORDER BY v.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching liked videos:", err);
    res.status(500).json({ error: "Failed to fetch liked videos" });
  }
});


// =================== SUBSCRIBED VIDEOS ROUTE ===================
// Check subscription
// Check if a user is subscribed to a channel
app.get("/api/subscriptions/check", async (req, res) => {
  const { user_id, channel_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE subscriber_id=$1 AND channel_id=$2",
      [user_id, channel_id]
    );
    res.json({ subscribed: result.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error checking subscription" });
  }
});

// Toggle subscription (subscribe/unsubscribe)
app.post("/api/subscriptions/toggle", async (req, res) => {
  const { user_id, channel_id } = req.body;
  try {
    const existing = await pool.query(
      "SELECT * FROM subscriptions WHERE subscriber_id=$1 AND channel_id=$2",
      [user_id, channel_id]
    );
    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM subscriptions WHERE subscriber_id=$1 AND channel_id=$2",
        [user_id, channel_id]
      );
      return res.json({ subscribed: false });
    } else {
      await pool.query(
        "INSERT INTO subscriptions (subscriber_id, channel_id, created_at) VALUES ($1, $2, NOW())",
        [user_id, channel_id]
      );
      return res.json({ subscribed: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error toggling subscription" });
  }
});

// Get subscribed channels for a user
app.get("/api/subscriptions/:userId/channels", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.avatar, c.description,
              COUNT(s2.subscriber_id) AS subscriber_count
       FROM subscriptions s
       JOIN channels c ON s.channel_id = c.id
       LEFT JOIN subscriptions s2 ON s2.channel_id = c.id
       WHERE s.subscriber_id = $1
       GROUP BY c.id, c.name, c.avatar, c.description`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching subscribed channels:", err);
    res.status(500).json({ error: "Error fetching subscriptions" });
  }
});

// ✅ Add a download (when user clicks Download)
app.post("/api/downloads", async (req, res) => {
  const { user_id, video_id } = req.body;

  try {
    const existing = await pool.query(
      "SELECT * FROM downloads WHERE user_id = $1 AND video_id = $2",
      [user_id, video_id]
    );

    if (existing.rows.length > 0) {
      return res.json({ message: "Already downloaded" });
    }

    const result = await pool.query(
      "INSERT INTO downloads (user_id, video_id) VALUES ($1, $2) RETURNING *",
      [user_id, video_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error saving download:", err);
    res.status(500).json({ error: "Error saving download" });
  }
});

// ✅ Get all downloads for a user
app.get("/api/downloads/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT v.* 
       FROM downloads d
       JOIN videos v ON d.video_id = v.id
       WHERE d.user_id = $1
       ORDER BY d.downloaded_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching downloads:", err);
    res.status(500).json({ error: "Error fetching downloads" });
  }
});

// Get channel info
app.get("/api/channels/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.avatar, c.description,
              COUNT(s.subscriber_id) AS subscriber_count
       FROM channels c
       LEFT JOIN subscriptions s ON s.channel_id = c.id
       WHERE c.id = $1
       GROUP BY c.id, c.name, c.avatar, c.description`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching channel:", err);
    res.status(500).json({ error: "Failed to fetch channel" });
  }
});

// Get videos of a specific channel
app.get("/api/channels/:id/videos", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, title, thumbnail
       FROM videos
       WHERE channel_id = $1
       ORDER BY created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching channel videos:", err);
    res.status(500).json({ error: "Failed to fetch channel videos" });
  }
});
// trending videos
app.get("/api/trending", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.id, v.title, v.thumbnail, v.views, v.created_at,
             c.name AS channel, c.avatar
      FROM videos v
      JOIN channels c ON v.channel_id = c.id
      ORDER BY v.views DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching trending videos:", err);
    res.status(500).json({ error: "Failed to fetch trending videos" });
  }
});

app.get("/api/explore", async (req, res) => {
  const categories = [
    { name: "Trending", image: "/assets/trending.png", path: "/trending" },
    { name: "Music", image: "/assets/music.png", path: "/category/music" },
    { name: "Gaming", image: "/assets/gaming.png", path: "/category/gaming" },
    { name: "Programming", image: "/assets/programming.png", path: "/category/programming" },
    { name: "News", image: "/assets/news.png", path: "/category/news" },
    { name: "Sports", image: "/assets/sports.png", path: "/category/sports" },
  ];
  res.json(categories);
});

// GET /api/history/:userId
app.get("/api/history/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT h.video_id AS id, v.title, v.thumbnail, v.duration, v.views, v.created_at,
             c.name AS channel
      FROM history h
      JOIN videos v ON h.video_id = v.id
      LEFT JOIN channels c ON v.channel_id = c.id
      WHERE h.user_id = $1
      ORDER BY h.watched_at DESC
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// GET /api/notifications/:userId
// ✅ GET user notifications
app.get("/api/notifications/:userId", async (req, res) => {
  const { userId } = req.params;

  // if userId is missing or "null" → return error
  if (!userId || userId === "null") {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production with https
    sameSite: "lax",
    path: "/",     // must match your cookie path
  });

  return res.json({ message: "Logged out successfully" });
});

// GET /api/me
app.get("/api/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await pool.query(
      "SELECT id, username, email, channel_id, avatar, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error /api/me:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all videos for a specific channel
app.get("/api/videos/channel/:channelId", async (req, res) => {
  const { channelId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM videos WHERE channel_id = $1",
      [channelId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create-channel", upload.single("avatar"), async (req, res) => {
  try {
    const { name, user_id } = req.body;
    const avatar = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO channels (name, user_id, avatar)
       VALUES ($1, $2, $3)
       RETURNING channel_id`,
      [name, user_id, avatar]
    );

    res.json({ channel_id: result.rows[0].channel_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating channel" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
