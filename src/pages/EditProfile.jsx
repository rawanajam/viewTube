import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(storedUser?.username || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", storedUser.id);
    formData.append("username", username);
    if (password) formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/api/edit-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Profile updated successfully!");
      navigate("/user-home");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-white flex items-start justify-center pt-20 pb-20">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleUpdate}>
          {/* Username */}
          <label className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
            placeholder="Enter new username"
          />

          {/* Password */}
          <label className="block mb-2 font-medium">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-neutral-800 mb-6 outline-none"
            placeholder="Enter new password (optional)"
          />

          {/* Avatar */}
          <label className="block mb-2 font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full mb-10"
          />

          {/* Update Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
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

export default EditProfile;
