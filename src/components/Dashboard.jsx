import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";

// Replace with your SerpAPI key here (keep it secret)
const SERPAPI_KEY =
  "c9e9c38e1f133adda02b92f48fa9eef68d6854b409fecc02cd366cd3082266e7";

const categories = [
  "cosmetics",
  "electronics",
  "fashion",
  "home appliances",
  "books",
];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategoryItems = async (category) => {
    setLoading(true);
    setError(null);
    setItems([]);

    try {
      // Google Shopping search query
      const searchQuery = encodeURIComponent(category);

      // SerpAPI Google Shopping endpoint
      const apiUrl = `https://corsproxy.io/?https://serpapi.com/search.json?engine=google_shopping&q=${searchQuery}&api_key=${SERPAPI_KEY}`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      // Extract product listings from the response
      const shoppingResults = data.shopping_results || [];

      // Map results to our items format
      const mappedItems = shoppingResults.map((item, index) => ({
        id: index,
        name: item.title,
        image: item.thumbnail,
        price: item.price,
        platform: item.source || "Unknown",
        link: item.link,
      }));

      setItems(mappedItems);
    } catch (err) {
      console.error("API error:", err);
      setError("Failed to fetch data from SerpAPI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryItems(selectedCategory);
    } else {
      setItems([]);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Welcome to ShopMania
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-500 hover:text-white transition`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length === 0 && selectedCategory && !loading && (
          <p className="text-center text-gray-600">No items found.</p>
        )}

        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
