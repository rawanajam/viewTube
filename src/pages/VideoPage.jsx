import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatViews } from "../utils/formatViews";
import {
ThumbsUp,
ThumbsDown,
Share2,
Repeat,
Download,
MoreHorizontal,
} from "lucide-react";

const VideoPage = () => {
const { id } = useParams();
const [video, setVideo] = useState(null);
const [likes, setLikes] = useState(0);
const [dislikes, setDislikes] = useState(0);
const [userAction, setUserAction] = useState(null);
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");

const userId = localStorage.getItem("user_id"); // Assuming you store user id in localStorage

// Fetch video, reactions, and comments
useEffect(() => {
if (!id) return;
const fetchVideoData = async () => {
  try {
    const videoRes = await axios.get(`http://localhost:5000/api/videos/${id}`);
    setVideo(videoRes.data);

    // Likes & dislikes
    const reactionsRes = await axios.get(
      `http://localhost:5000/api/videos/${id}/reactions`
    );
    setLikes(reactionsRes.data.likes || 0);
    setDislikes(reactionsRes.data.dislikes || 0);

    // Comments
    const commentsRes = await axios.get(
      `http://localhost:5000/api/videos/${id}/comments`
    );
    setComments(commentsRes.data);
  } catch (err) {
    console.error(err);
  }
};

fetchVideoData();

}, [id]);

const handleReaction = async (type) => {
if (!userId) return alert("Please login to react.");

try {
  await axios.post(`http://localhost:5000/api/videos/${id}/reactions`, {
    user_id: userId,
    type,
  });

  // Update UI locally
  if (type === "like") {
    if (userAction === "like") {
      setLikes(likes - 1);
      setUserAction(null);
    } else {
      setLikes(likes + 1);
      if (userAction === "dislike") setDislikes(dislikes - 1);
      setUserAction("like");
    }
  } else if (type === "dislike") {
    if (userAction === "dislike") {
      setDislikes(dislikes - 1);
      setUserAction(null);
    } else {
      setDislikes(dislikes + 1);
      if (userAction === "like") setLikes(likes - 1);
      setUserAction("dislike");
    }
  }
} catch (err) {
  console.error("Error reacting:", err);
}

};

// Handle posting a new comment
const handleComment = async () => {
if (!userId) return alert("Please login to comment.");
if (!newComment.trim()) return;

try {
  const res = await axios.post(
    `http://localhost:5000/api/videos/${id}/comments`,
    {
      user_id: userId,
      content: newComment,
    }
  );
  setComments([res.data, ...comments]);
  setNewComment("");
} catch (err) {
  console.error("Error posting comment:", err);
}

};

if (!video) return <div className="pt-14 text-center text-white">Loading...</div>;

return ( <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4"> <div className="flex flex-col lg:flex-row gap-8"> <div className="flex-1">
{/* Video player */}
<video
controls
className="w-full rounded-xl mb-4"
src={`http://localhost:5000${video.videoUrl}`}
/>

      {/* Video title */}
      <h1 className="text-2xl font-semibold mb-2">{video.title}</h1>

      {/* Channel + stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400 mb-3">
        <p>{video.channel}</p>
        <p>
          {formatViews(video.views)} views •{" "}
          {new Date(video.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            userAction === "like"
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <ThumbsUp size={18} /> {likes}
        </button>

        <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            userAction === "dislike"
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <ThumbsDown size={18} /> {dislikes}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition">
          <Share2 size={18} /> Share
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition">
          <Download size={18} /> Download
        </button>
        
      </div>

      {/* Description */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300 whitespace-pre-line">{video.description}</p>
      </div>

      {/* Comments */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Comments • {comments.length}</h2>

        {/* Add new comment */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-gray-800 text-white outline-none"
          />
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-emerald-500 rounded-lg text-black font-semibold hover:bg-emerald-600 transition"
          >
            Post
          </button>
        </div>

        {/* Existing comments */}
        {comments.length ? (
          comments.map((c) => (
            <div key={c.id} className="mb-4">
              <p className="text-sm font-medium text-gray-200">{c.username}</p>
              <p className="text-gray-400">{c.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}
      </div>
    </div>

    {/* Recommended sidebar */}
    <aside className="w-full lg:w-80">
      <h3 className="font-semibold mb-3">Recommended</h3>
      {/* Recommended videos placeholder */}
    </aside>
  </div>
</main>

);
};

export default VideoPage;
