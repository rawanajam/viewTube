import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [mode, setMode] = useState("user");
  const [action, setAction] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setMode((prev) => (prev === "user" ? "admin" : "user"));
        setError("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url =
        mode === "admin"
          ? "http://localhost:5000/api/admin-login"
          : action === "signup"
          ? "http://localhost:5000/api/signup"
          : "http://localhost:5000/api/login";

      const payload =
        action === "signup" && mode === "user"
          ? { username, email, password }
          : { email, password };

      const res = await axios.post(url, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", res.data.user_id);

      if (res.data.role === "user") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: res.data.user_id,
            username: res.data.username,
            avatar: res.data.avatar || null,
            joined: res.data.created_at,
            channel_id: res.data.channel_id || null,
          })
        );
      }

      if (res.data.role === "admin") {
        navigate("/owner-dashboard");   // your new admin/owner page
      } else {
        navigate("/user-home");
      }

    } catch {
      setError(
        mode === "admin"
          ? "Invalid admin credentials"
          : action === "signup"
          ? "Email already exists or invalid data"
          : "Invalid credentials, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-6"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <Video className="h-7 w-7 text-red-500" />
            <h2 className="text-2xl font-bold">
              {mode === "admin"
                ? "Admin Login"
                : action === "signup"
                ? "Create Account"
                : "Login"}
            </h2>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            {mode === "admin"
              ? "Admin panel access only"
              : action === "signup"
              ? "Create your ViewTube account"
              : "Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "user" && action === "signup" && (
            <Input
              type="text"
              placeholder="Username"
              className="bg-neutral-900 text-white border-neutral-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <Input
            type="email"
            placeholder="Email"
            className="bg-neutral-900 text-white border-neutral-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            className="bg-neutral-900 text-white border-neutral-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 font-semibold"
          >
            {loading
              ? "Processing..."
              : mode === "admin"
              ? "Admin Login"
              : action === "signup"
              ? "Sign Up"
              : "Login"}
          </Button>
        </form>

        {/* Switch login / signup */}
        {mode === "user" && (
          <p className="text-center text-gray-400 text-sm mt-4">
            {action === "login" ? (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => setAction("signup")}
                  className="text-red-500 cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setAction("login")}
                  className="text-red-500 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </>
            )}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-center text-sm mt-3">{error}</p>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
