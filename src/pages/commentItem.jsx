import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const CommentItem = ({ comment, userId }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comment/likes/${comment.id}`
      );
      setLikes(res.data.likes || 0);
      setDislikes(res.data.dislikes || 0);
    } catch (err) {
      console.error("Error fetching comment likes:", err);
    }
  };

  const handleReaction = async (type) => {
    if (!userId) {
      alert("Please log in to react.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/comment/like", {
        user_id: userId,
        comment_id: comment.id,
        type,
      });

      if (type === "like") {
        if (userReaction === "like") {
          setUserReaction(null);
          setLikes((prev) => prev - 1);
        } else {
          setUserReaction("like");
          setLikes((prev) => prev + 1);
          if (userReaction === "dislike") setDislikes((prev) => prev - 1);
        }
      } else {
        if (userReaction === "dislike") {
          setUserReaction(null);
          setDislikes((prev) => prev - 1);
        } else {
          setUserReaction("dislike");
          setDislikes((prev) => prev + 1);
          if (userReaction === "like") setLikes((prev) => prev - 1);
        }
      }
    } catch (err) {
      console.error("Error reacting to comment:", err);
    }
  };

  return (
    <div className="p-3 border-b border-gray-700">
      <p className="text-gray-200">{comment.content}</p>

      <div className="flex gap-3 mt-2 text-gray-400 text-sm">
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-1 hover:text-green-500 transition ${
            userReaction === "like" ? "text-green-500" : ""
          }`}
        >
          <ThumbsUp size={16} /> {likes}
        </button>

        <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center gap-1 hover:text-red-500 transition ${
            userReaction === "dislike" ? "text-red-500" : ""
          }`}
        >
          <ThumbsDown size={16} /> {dislikes}
        </button>
      </div>
    </div>
  );
};

export default CommentItem;
