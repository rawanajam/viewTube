import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ExplorePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/explore")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching explore categories:", err));
  }, []);

  return (
    <main className="pt-16 min-h-screen bg-black text-white container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">🔍 Explore</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}
            className="relative group overflow-hidden rounded-xl bg-gray-900 hover:bg-gray-800 transition shadow-lg"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition"
            />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ExplorePage;
