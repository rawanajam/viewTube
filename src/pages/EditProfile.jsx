import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // User states
  const [username, setUsername] = useState(storedUser?.username || "");

  // Channel states
  const [channelName, setChannelName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // Collapsible sections
  const [openUsernameBox, setOpenUsernameBox] = useState(false);
  const [openChannelNameBox, setOpenChannelNameBox] = useState(false);
  const [openPasswordBox, setOpenPasswordBox] = useState(false);
  const [openPictureBox, setOpenPictureBox] = useState(false);

  // Fetch channel info if user has a channel
  useEffect(() => {
    const fetchChannel = async () => {
      if (storedUser.channel_id) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/channel/${storedUser.channel_id}`
          );
          setChannelName(res.data.channel_name || "");
          setPreview(res.data.avatar || null);
        } catch (err) {
          console.error("Failed to fetch channel info:", err);
        }
      }
    };
    fetchChannel();
  }, [storedUser.channel_id]);

  // Password validation
  const isStrongPassword = (pw) =>
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (!isStrongPassword(newPassword)) {
        return alert(
          "Password must be 8+ characters, with uppercase, lowercase, number & symbol."
        );
      }
      if (newPassword !== confirmPassword) {
        return alert("New password and confirmation do not match!");
      }
    }

    const formData = new FormData();
    formData.append("user_id", storedUser.id);

    if (openUsernameBox) formData.append("username", username);
    if (openChannelNameBox && storedUser.channel_id)
      formData.append("channel_name", channelName);
    if (openPasswordBox) {
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
    }
    if (openPictureBox && avatar) formData.append("avatar", avatar);

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/edit-profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Profile updated!");
      navigate("/user-home");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-white flex justify-center pt-20 pb-20">
      <div className="w-full max-w-3xl space-y-8">
        <h2 className="text-3xl font-semibold text-center">Edit Profile</h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* USERNAME */}
          <div className="bg-neutral-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenUsernameBox(!openUsernameBox)}
              className="w-full p-4 font-semibold bg-neutral-700 hover:bg-neutral-600 transition"
            >
              Edit Username
            </button>
            {openUsernameBox && (
              <div className="p-4">
                <label className="font-medium">New Username</label>
                <input
                  type="text"
                  className="w-full p-3 mt-2 rounded bg-neutral-700"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* CHANNEL NAME & AVATAR */}
          {storedUser.channel_id && (
            <>
              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenChannelNameBox(!openChannelNameBox)}
                  className="w-full p-4 font-semibold bg-neutral-700 hover:bg-neutral-600 transition"
                >
                  Edit Channel Name
                </button>
                {openChannelNameBox && (
                  <div className="p-4">
                    <label className="font-medium">New Channel Name</label>
                    <input
                      type="text"
                      className="w-full p-3 mt-2 rounded bg-neutral-700"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenPictureBox(!openPictureBox)}
                  className="w-full p-4 font-semibold bg-neutral-700 hover:bg-neutral-600 transition"
                >
                  Change Profile Picture
                </button>
                {openPictureBox && (
                  <div className="p-4">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full mb-4 object-cover border border-neutral-600"
                      />
                    ) : (
                      <p>No image selected</p>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setAvatar(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      }}
                      className="w-full bg-neutral-700 p-2 rounded"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* PASSWORD */}
          <div className="bg-neutral-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenPasswordBox(!openPasswordBox)}
              className="w-full p-4 font-semibold bg-neutral-700 hover:bg-neutral-600 transition"
            >
              Change Password
            </button>
            {openPasswordBox && (
              <div className="p-4 space-y-3">
                <input
                  type="password"
                  placeholder="Old Password"
                  className="w-full p-3 bg-neutral-700 rounded"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-3 bg-neutral-700 rounded"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full p-3 bg-neutral-700 rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <p className="text-sm text-neutral-300 mt-2">
                  • Must be 8+ characters  
                  • Uppercase & lowercase  
                  • Number & symbol  
                </p>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <button
            type="submit"
            className="w-full mt-4 bg-red-600 p-3 rounded-lg font-semibold hover:bg-red-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/user-home")}
            className="w-full bg-neutral-700 p-3 rounded-lg font-semibold hover:bg-neutral-600 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
