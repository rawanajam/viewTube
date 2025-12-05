import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateChannelPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [channelName, setChannelName] = useState("");
  const [channelDescrip, setChannelDescrip] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelName) return alert("Channel name is required");

    const formData = new FormData();
    formData.append("name", channelName);
    formData.append("description", channelDescrip);
    formData.append("user_id", user.id);
    if (avatar) formData.append("avatar", avatar);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/create-channel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newChannel = res.data;

      // update user in localStorage
      const updatedUser = {
        ...user,
        channel_id: newChannel.channel_id,
        avatar: newChannel.avatar || user.avatar  // update avatar immediately
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Channel created successfully!");
      navigate("/user-home");
    } catch (err) {
      console.error(err);
      alert("Error creating channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-white flex items-start justify-center pt-20">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Create Your Channel
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Channel Name */}
          <label className="block mb-2 font-medium">Channel Name</label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
            placeholder="Enter Channel Name"
          />

          {/* Channel Description */}
          <label className="block mb-2 font-medium">Channel Description</label>
          <input
            type="text"
            value={channelDescrip}
            onChange={(e) => setChannelDescrip(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
            placeholder="Enter Channel Description"
          />

          {/* Avatar Upload */}
          <label className="block mb-2 font-medium">
            Channel Avatar (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full mb-10"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Channel"}
          </button>

          {/* Cancel */}
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

export default CreateChannelPage;
