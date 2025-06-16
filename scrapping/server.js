// server.js
const express = require('express');
const cors = require('cors');
// Import the necessary Flipkart scraping function and the initializer
const {
  scrapeFlipkart,
  getConfig,
  initializeBrowser // New function to initialize the browser once
} = require('./scrapping'); // Path to your consolidated scrapping.js file

const app = express();
const PORT = process.env.PORT || 3001; // Backend will run on port 5000

// --- Initialize the browser when the server starts ---
// This is crucial for speed as it avoids launching a browser per request.
let isBrowserInitialized = false;
async function startBrowser() {
  if (!isBrowserInitialized) {
    console.log("Initializing Puppeteer browser instance...");
    await initializeBrowser();
    isBrowserInitialized = true;
    console.log("Puppeteer browser initialized.");
  }
}
startBrowser(); // Call the initialization function when the server starts

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// --- E-commerce Product Scraping Endpoint (for Flipkart Only) ---
app.get('/api/products/flipkart/:query', async (req, res) => {
  const { query } = req.params;
  let products = [];
  const config = getConfig(); // Get default config

  console.log(`Received request to scrape Flipkart for: "${query}"`);

  try {
    // Call the optimized scrapeFlipkart function which reuses the browser
    products = await scrapeFlipkart(query, config);

    if (products.length === 0) {
      console.warn(`No products found for "${query}" on Flipkart.`);
      res.json([]); // Return empty array if no products found
    } else {
      res.json(products);
    }

  } catch (error) {
    console.error(`Error scraping Flipkart for "${query}":`, error);
    res.status(500).json({ error: `Failed to scrape products from Flipkart. Check backend console for details.` });
  }
});

// Basic root route for testing if the server is running
app.get('/', (req, res) => {
  res.send('E-Commerce Scraper Backend is running (Flipkart only)!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
