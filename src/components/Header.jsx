import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Menu, Video, Bell, User } from "lucide-react";
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setInput("");
    }
  }, [location]);

  // fetch live suggestions with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/videos/search?q=${input}`);
        setSuggestions(res.data.slice(0, 5)); // show top 5 results
      } catch (error) {
        console.error("Suggestion error:", error);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [input]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(input.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setInput(title);
    navigate(`/search?q=${title}`);
    setShowDropdown(false);
  };

  // 🔹 Redirect to Login page
  const handleLoginClick = () => {
    navigate("/login");
  };

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
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full bg-secondary border-border pl-4 pr-4 h-10 focus-visible:ring-1 focus-visible:ring-primary"
            />

            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute bg-background border border-border rounded-md shadow-lg mt-1 w-full z-50">
                {suggestions.map((video) => (
                  <li
                    key={video.id}
                    onClick={() => handleSuggestionClick(video.title)}
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
        <Button variant="ghost" size="icon" className="hover:bg-youtube-hover">
          <Video className="h-5 w-5" />
        </Button>
        <NotificationsButton/>

        {/* 👇 Login Redirect Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-youtube-hover"
          onClick={handleLoginClick}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
