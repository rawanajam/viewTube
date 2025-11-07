import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { formatViews } from "../utils/formatViews";
import { ThumbsUp, ThumbsDown, Share2, Download, PlaySquare } from "lucide-react";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const userId = localStorage.getItem("user_id");

  // Fetch video data
  useEffect(() => {
    if (!id) return;
    const fetchVideoData = async () => {
      try {
        const videoRes = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(videoRes.data);

        const reactionsRes = await axios.get(`http://localhost:5000/api/videos/${id}/reactions`);
        setLikes(Number(reactionsRes.data.likes) || 0);
        setDislikes(Number(reactionsRes.data.dislikes) || 0);

        const commentsRes = await axios.get(`http://localhost:5000/api/videos/${id}/comments`);
        setComments(commentsRes.data);

        const recRes = await axios.get(`http://localhost:5000/api/videos`);
        const filtered = recRes.data.filter((v) => v.id !== Number(id));
        setRecommended(filtered.slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideoData();
  }, [id]);

  // Scroll to top when changing video
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Check subscription status
  useEffect(() => {
    if (!userId || !video?.user_id) return;
    // When checking subscription
      const checkSubscription = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/subscriptions/check`, {
            params: { user_id: userId, channel_id: video.channel_id },
          });
          setIsSubscribed(res.data.subscribed);
        } catch (err) { console.error(err); }
      };

    checkSubscription();
  }, [userId, video]);

  // Toggle subscription
  const handleSubscribe = async () => {
  if (!userId) return alert("Please login to subscribe.");
  try {
    const res = await axios.post(`http://localhost:5000/api/subscriptions/toggle`, {
      user_id: userId,
      channel_id: video.channel_id,
    });
    setIsSubscribed(res.data.subscribed);
  } catch (err) { console.error(err); }
};

  // Handle like / dislike
  const handleReaction = async (type) => {
    if (!userId) return alert("Please login to react.");
    try {
      await axios.post(`http://localhost:5000/api/videos/${id}/reactions`, { user_id: userId, type });
      if (type === "like") {
        if (userAction === "like") {
          setLikes((prev) => Math.max(prev - 1, 0));
          setUserAction(null);
        } else {
          setLikes((prev) => prev + 1);
          if (userAction === "dislike") setDislikes((prev) => Math.max(prev - 1, 0));
          setUserAction("like");
        }
      } else {
        if (userAction === "dislike") {
          setDislikes((prev) => Math.max(prev - 1, 0));
          setUserAction(null);
        } else {
          setDislikes((prev) => prev + 1);
          if (userAction === "like") setLikes((prev) => Math.max(prev - 1, 0));
          setUserAction("dislike");
        }
      }
    } catch (err) {
      console.error("Error reacting:", err);
    }
  };

const handleDownload = async () => {
  if (!userId) return alert("Please login to download this video.");

  try {
    // Save download info in DB
    await axios.post("http://localhost:5000/api/downloads", {
      user_id: userId,
      video_id: id,
    });

    alert("Video added to your downloads!");
  } catch (err) {
    console.error("Error saving download:", err);
  }
};


  const handleShare = async () => {
    const shareData = {
      title: video.title,
      text: "Check out this video!",
      url: `${window.location.origin}/video/${video.id}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied! You can share it on WhatsApp, Messenger, etc.");
    }
  };

  const handleComment = async () => {
    if (!userId) return alert("Please login to comment.");
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/videos/${id}/comments`, {
        user_id: userId,
        content: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (!video) return <div className="pt-14 text-center text-white">Loading...</div>;

  return (
    <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <video
            controls
            className="w-full rounded-xl mb-4"
            src={`http://localhost:5000${video.videoUrl}`}
          />
          <h1 className="text-2xl font-semibold mb-2">{video.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400 mb-3">
            <p>{video.channel}</p>
            <p>
              {formatViews(video.views)} views •{" "}
              {new Date(video.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Buttons */}
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
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              <Share2 size={18} /> Share
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              <Download size={18} /> Download
            </button>
            <button
              onClick={handleSubscribe}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                isSubscribed
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <PlaySquare size={18} /> {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Description */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300 whitespace-pre-line">
              {video.description}
            </p>
          </div>

          {/* Comments */}
          <div>
            <h2 className="font-semibold text-lg mb-4">
              Comments • {comments.length}
            </h2>
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
                className="px-4 py-2 bg-red-500 rounded-lg text-black font-semibold hover:bg-red-600 transition"
              >
                Post
              </button>
            </div>

            {comments.length > 0 ? (
              <>
                {comments
                  .slice(0, showAllComments ? comments.length : 1)
                  .map((c) => (
                    <CommentItem key={c.id} comment={c} userId={userId} />
                  ))}
                {comments.length > 1 && (
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    {showAllComments
                      ? "Show less comments"
                      : `View all ${comments.length} comments`}
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500">No comments yet</p>
            )}
          </div>

          {/* Suggested Videos */}
          <div className="mt-10">
            <h2 className="font-semibold text-lg mb-4">Suggested Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.length > 0 ? (
                recommended.map((vid) => {
                  const thumbnailUrl = vid.thumbnail
                    ? vid.thumbnail.startsWith("/assets")
                      ? vid.thumbnail
                      : `/uploads/${vid.thumbnail}`
                    : "/assets/placeholder.jpg";

                  return (
                    <Link
                      to={`/video/${vid.id}`}
                      key={vid.id}
                      className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-semibold text-sm text-white line-clamp-2">
                          {vid.title}
                        </p>
                        <p className="text-xs text-gray-400">{vid.channel}</p>
                        <p className="text-xs text-gray-400">
                          {formatViews(vid.views)} views
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-500">No suggested videos available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// ===================== COMMENT ITEM =====================
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
      setLikes(Number(res.data.likes) || 0);
      setDislikes(Number(res.data.dislikes) || 0);

      if (userId) {
        const reactionRes = await axios.get(
          `http://localhost:5000/api/comment/reaction/${comment.id}/${userId}`
        );
        setUserReaction(reactionRes.data.reaction);
      }
    } catch (err) {
      console.error("Error fetching comment likes:", err);
    }
  };

  const handleReaction = async (type) => {
    if (!userId) return alert("Please login to react.");
    try {
      await axios.post(`http://localhost:5000/api/comment/like`, {
        user_id: userId,
        comment_id: comment.id,
        type,
      });

      if (type === "like") {
        if (userReaction === "like") {
          setLikes(likes - 1);
          setUserReaction(null);
        } else {
          setLikes(likes + 1);
          if (userReaction === "dislike") setDislikes(dislikes - 1);
          setUserReaction("like");
        }
      } else {
        if (userReaction === "dislike") {
          setDislikes(dislikes - 1);
          setUserReaction(null);
        } else {
          setDislikes(dislikes + 1);
          if (userReaction === "like") setLikes(likes - 1);
          setUserReaction("dislike");
        }
      }
    } catch (err) {
      console.error("Error reacting:", err);
    }
  };

  return (
    <div className="mb-4 border-b border-gray-700 pb-2">
      <p className="text-sm font-medium text-gray-200">{comment.username}</p>
      <p className="text-gray-400">{comment.content}</p>
      <div className="flex gap-3 mt-1 text-gray-400 text-sm">
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center gap-1 hover:text-red-500 transition ${
            userReaction === "like" ? "text-red-500" : ""
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

export default VideoPage;
