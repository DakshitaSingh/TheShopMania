// server.js
const express = require('express');
const cors = require('cors');

// Import both scraping functions from your scrapping.js file
const {
    scrapeFlipkart,
    scrapeMyntra, // <-- ADDED
    getConfig,
    initializeBrowser
} = require('./scrapping');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Initialize the browser when the server starts (Unchanged) ---
let isBrowserInitialized = false;
async function startBrowser() {
    if (!isBrowserInitialized) {
        console.log("Initializing Puppeteer browser instance...");
        await initializeBrowser();
        isBrowserInitialized = true;
        console.log("Puppeteer browser initialized.");
    }
}
startBrowser();

// --- Middleware (Unchanged) ---
app.use(cors());
app.use(express.json());

// =================================================================
// START: UPDATED DYNAMIC API ENDPOINT
// This single endpoint handles all supported platforms.
// =================================================================
app.get('/api/products/:platform/:query', async (req, res) => {
    const { platform, query } = req.params;
    const config = getConfig();
    let products = [];

    console.log(`Received request to scrape ${platform} for: "${query}"`);

    try {
        switch (platform.toLowerCase()) {
            case 'flipkart':
                // Your existing Flipkart logic is called here
                products = await scrapeFlipkart(query, config);
                break;
            case 'myntra':
                // The new Myntra logic is called here
                products = await scrapeMyntra(query, config);
                break;
            default:
                // Handle unsupported platforms
                return res.status(404).json({ error: `Platform '${platform}' is not supported.` });
        }

        if (products.length === 0) {
            console.warn(`No products found for "${query}" on ${platform}.`);
        }
        res.json(products);

    } catch (error) {
        console.error(`Error scraping ${platform} for "${query}":`, error);
        res.status(500).json({ error: `Failed to scrape products from ${platform}.` });
    }
});
// =================================================================
// END: UPDATED DYNAMIC API ENDPOINT
// =================================================================

// Basic root route for testing if the server is running
app.get('/', (req, res) => {
    res.send('E-Commerce Scraper Backend is running (Flipkart & Myntra)!'); // Updated message
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});