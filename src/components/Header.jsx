import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Menu, Video, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationsButton from "../pages/NotificationsButton";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from localStorage and react to changes
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      const storedUserId = localStorage.getItem("userId");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // Reset search input if path changes
  useEffect(() => {
    if (!location.pathname.startsWith("/search")) setInput("");
  }, [location]);

  // Fetch live suggestions with debounce
  useEffect(() => {
    if (!input.trim()) return setSuggestions([]);
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/videos/search?q=${input}`
        );
        setSuggestions(res.data.slice(0, 5)); // top 5
      } catch (error) {
        console.error("Suggestion fetch error:", error);
      }
    };
    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [input]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (video) => {
    setInput(video.title);
    navigate(`/search?q=${encodeURIComponent(video.title)}`);
    setShowDropdown(false);
  };

  const handleLoginClick = () => navigate("/login");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background px-4 h-14">
      {/* Logo + Sidebar */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-youtube-hover"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1">
          <Video className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">ViewTube</span>
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-2xl relative"
        autoComplete="off"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search videos"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
              className="w-full bg-secondary border-border pl-4 pr-4 h-10 focus-visible:ring-1 focus-visible:ring-primary"
            />

            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute bg-background border border-border rounded-md shadow-lg mt-1 w-full z-50">
                {suggestions.map((video) => (
                  <li
                    key={video.id}
                    onClick={() => handleSuggestionClick(video)}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                  >
                    {video.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            className="bg-secondary hover:bg-youtube-hover border border-border"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <NotificationsButton userId={user?.id} />

          <Button
  variant="ghost"
  size="icon"
  className="rounded-full hover:bg-youtube-hover"
  onClick={() => {
    if (user) navigate("/user-home");
    else navigate("/login");
  }}
  title={user?.username || "Login"}
>
  {user ? (
    user.avatar ? (
      <img
        src={user.avatar}
        alt="avatar"
        className="h-8 w-8 rounded-full object-cover"
      />
    ) : (
      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white font-semibold">
        {user.username?.charAt(0).toUpperCase() || "U"}
      </div>
    )
  ) : (
    <User className="h-6 w-6" />
  )}
</Button>




      </div>
    </header>
  );
};
