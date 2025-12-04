import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(storedUser?.username || "");

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Avatar
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // Collapsible section states
  const [openPasswordBox, setOpenPasswordBox] = useState(false);
  const [openPictureBox, setOpenPictureBox] = useState(false);
  const [openUsernameBox, setOpenUsernameBox] = useState(false);

  const isStrongPassword = (pw) => {
    return (
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw)
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (!isStrongPassword(newPassword)) {
        return alert(
          "Password must be 8+ characters, have uppercase, lowercase, number, and symbol."
        );
      }
      if (newPassword !== confirmPassword) {
        return alert("New password and confirmation do not match!");
      }
    }

    const formData = new FormData();
    formData.append("user_id", storedUser.id);

    if (openUsernameBox) formData.append("username", username);
    if (openPasswordBox) {
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
    }
    if (openPictureBox && avatar) {
      formData.append("avatar", avatar);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/edit-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
    <div className="w-full min-h-screen bg-neutral-900 text-white flex justify-center pt-20 pb-20">
      <div className="w-full max-w-3xl space-y-8">

        <h2 className="text-3xl font-semibold text-center">Edit Profile</h2>

        <form onSubmit={handleUpdate} className="space-y-5">

          {/* ---------------- USERNAME SECTION ---------------- */}
          <div className="bg-neutral-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenUsernameBox(!openUsernameBox)}
              className="w-full text-left p-4 font-semibold bg-neutral-700 hover:bg-neutral-600 transition"
            >
              Edit Username
            </button>

            <div
              className={`transition-all duration-300 ${
                openUsernameBox ? "max-h-[300px] p-4" : "max-h-0 p-0 overflow-hidden"
              }`}
            >
              <label className="block mb-2 font-medium">New Username</label>
              <input
                type="text"
                className="w-full p-3 rounded bg-neutral-700 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* ---------------- PASSWORD SECTION ---------------- */}
          <div className="bg-neutral-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenPasswordBox(!openPasswordBox)}
              className="w-full text-left p-4 font-semibold bg-neutral-700 hover:bg-neutral-600 transition"
            >
              Change Password
            </button>

            <div
              className={`transition-all duration-300 ${
                openPasswordBox ? "max-h-[500px] p-4" : "max-h-0 p-0 overflow-hidden"
              }`}
            >
              <label className="block mb-2 font-medium">Old Password</label>
              <input
                type="password"
                className="w-full p-3 rounded bg-neutral-700 mb-4 outline-none"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <label className="block mb-2 font-medium">New Password</label>
              <input
                type="password"
                className="w-full p-3 rounded bg-neutral-700 mb-4 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label className="block mb-2 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded bg-neutral-700 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <p className="text-sm text-neutral-300 mt-2">
                • Must be 8+ characters  
                • Uppercase & lowercase  
                • Number & symbol  
              </p>
            </div>
          </div>

          {/* ---------------- PICTURE SECTION ---------------- */}
          <div className="bg-neutral-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenPictureBox(!openPictureBox)}
              className="w-full text-left p-4 font-semibold bg-neutral-700 hover:bg-neutral-600 transition"
            >
              Change Profile Picture
            </button>

            <div
              className={`transition-all duration-300 ${
                openPictureBox ? "max-h-[600px] p-4" : "max-h-0 p-0 overflow-hidden"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover mb-4 border border-neutral-600"
                />
              ) : (
                <p className="text-neutral-400 mb-4">No image selected</p>
              )}

              <input
                type="file"
                accept="image/*"
                className="w-full bg-neutral-700 p-2 rounded"
                onChange={(e) => {
                  setAvatar(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </div>
          </div>

          {/* ---------------- ACTION BUTTONS ---------------- */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/user-home")}
            className="w-full bg-neutral-700 hover:bg-neutral-600 p-3 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
