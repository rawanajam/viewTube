import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = ["music", "gaming", "programming", "news", "sports"];

const CreateVideoPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !videoFile) return alert("Title and video are required");
    if (!category) return alert("Category is required");
    if (!duration) return alert("Duration is required");
    if (!user.channel_id) return alert("You must create a channel first!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("duration", duration);
    formData.append("channel_id", user.channel_id);
    formData.append("video", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/create-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Video uploaded successfully!");
      navigate("/user-home");
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-white flex items-start justify-center pt-20 pb-20">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Upload a Video
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Video Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
            placeholder="Enter video title"
          />

          <label className="block mb-2 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
            placeholder="Add description"
          />

          <label className="block mb-2 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Duration (e.g., 5:30)</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
            placeholder="Enter duration"
          />

          <label className="block mb-2 font-medium">
            Upload Video File (required)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full mb-6"
          />

          <label className="block mb-2 font-medium">Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full mb-10"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/user-home")}
            className="w-full mt-4 bg-neutral-700 hover:bg-neutral-600 p-3 rounded font-semibold"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVideoPage;
