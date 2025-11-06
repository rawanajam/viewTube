import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [mode, setMode] = useState("user"); // "user" or "admin"
  const [action, setAction] = useState("login"); // "login" or "signup"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hidden keyboard shortcut for admin mode
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

  // Handle login or signup
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
      navigate(res.data.role === "admin" ? "/admin" : "/");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background glowing circles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 bg-red-600/30 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-md border rounded-2xl shadow-2xl p-8 backdrop-blur-md ${
          mode === "admin"
            ? "bg-gray-900/80 border-gray-700"
            : "bg-gray-900/60 border-gray-800"
        }`}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Video
              className={`h-8 w-8 ${
                mode === "admin" ? "text-gray-400" : "text-red-500"
              }`}
            />
            <span className="text-2xl font-bold">
              {mode === "admin"
                ? "Admin Access"
                : action === "signup"
                ? "Create Account"
                : "ViewTube Login"}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            {mode === "admin"
              ? "Restricted area — authorized personnel only"
              : action === "signup"
              ? "Join ViewTube today"
              : "Sign in to continue watching"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "user" && action === "signup" && (
            <Input
              type="text"
              placeholder="Username"
              className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-red-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <Input
            type="email"
            placeholder="Email"
            className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold transition-all ${
              mode === "admin"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? mode === "admin"
                ? "Verifying Admin..."
                : action === "signup"
                ? "Creating Account..."
                : "Signing in..."
              : mode === "admin"
              ? "Login as Admin"
              : action === "signup"
              ? "Sign Up"
              : "Login"}
          </Button>
        </form>

        {mode === "user" && (
          <p className="text-sm text-gray-400 text-center mt-3">
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
          <p className="text-red-400 text-sm text-center mt-3">{error}</p>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
