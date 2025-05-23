import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.SCRAPER_API_KEY;
const BASE = `http://api.scraperapi.com?api_key=${API_KEY}&autoparse=true`;

const PLATFORM_QUERIES = {
  amazon: (cat) => `https://www.amazon.in/s?k=${cat}`,
  flipkart: (cat) => `https://www.flipkart.com/search?q=${cat}`,
  myntra: (cat) => `https://www.myntra.com/${cat}`,
};

app.get("/products/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const fetches = Object.entries(PLATFORM_QUERIES).map(
      async ([platform, buildUrl]) => {
        const url = `${BASE}&url=${encodeURIComponent(buildUrl(category))}`;
        const { data } = await axios.get(url);

        const products = data.products || [];
        return products.slice(0, 5).map((p) => ({
          name: p.title || p.name || "No Title",
          platform,
          price: p.price?.value || p.price || "N/A",
          link: p.link,
          image: p.image || "",
        }));
      }
    );

    const allResults = await Promise.all(fetches);
    res.json(allResults.flat());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed." });
  }
});

export default app;
