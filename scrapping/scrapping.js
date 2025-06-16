// scrapping.js
const puppeteer = require("puppeteer"); // Still require puppeteer for types
const cheerio = require("cheerio");
const launchBrowser = require('./chrome'); // This imports the browser launcher from your local chrome.js

let browserInstance = null; // Global variable to hold the persistent browser instance

const getConfig = () => ({
  maxProducts: 16,
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
  navigationTimeout: 60000, // Reduced navigation timeout slightly, can be adjusted
  waitForSelectorTimeout: 10000, // Reduced wait for selector timeout
  retryCount: 2 // Reduced retries, to fail faster if issues persist
});

// Function to initialize the browser instance once
const initializeBrowser = async () => {
  if (!browserInstance || !browserInstance.isConnected()) {
    console.log("Launching new persistent browser instance...");
    browserInstance = await launchBrowser();
  }
  return browserInstance;
};

// Function to auto-scroll a page (potentially faster/less scrolling)
const autoScroll = async (page, maxScrolls = 5) => { // Reduced max scrolls for speed
  console.log("Scrolling the page...");
  await page.evaluate(async (maxScrolls) => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let scrolls = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrolls++;
        if (scrolls >= maxScrolls || (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100); // Reduced delay between scrolls
    });
  }, maxScrolls);
};

// Product parsing function specifically for Flipkart
const parseFlipkartProducts = ($, selector, config) => {
  const results = [];
  console.log(`\n🔍 Starting to parse products for: Flipkart`);

  $(selector).each((index, el) => {
    if (results.length >= config.maxProducts) {
      return false; // Break from .each loop if max products are found
    }

    let title = "";
    let link = "";
    let image = "";
    let priceText = "";

    try {
      const brand = $(el).find(".syl9yP").text().trim();
      const productName = $(el).find("a.WKTcLC").text().trim();
      title = `${brand} ${productName}`;
      const relativeLink = $(el).find("a.WKTcLC").attr("href");
      link = relativeLink ? `https://www.flipkart.com${relativeLink}` : "";
      image = $(el).find("img._53J4C-").attr("src") || "";
      priceText = $(el)
        .find(".Nx9bqj")
        .first()
        .text()
        .replace(/[₹,]/g, "")
        .trim();

      const price = parseInt(priceText, 10) || 0;
      const platform = "flipkart";

      if (title && !isNaN(price) && price > 0) {
        // Price filtering is removed as it's not part of the current minimal request
        // If price filtering is needed, it would be based on backend criteria or omitted
        results.push({
          title,
          image_url: image || 'https://placehold.co/150x150/e0e0e0/ffffff?text=No+Image', // Fallback image
          link,
          price: `₹${price}`, // Format price with rupee symbol
          description: title, // Use title as description, or fetch more if available
          platform: platform
        });
      } else {
        console.log("❌ Missing or invalid title/price. Skipping.");
      }
    } catch (error) {
      console.error(`❗ Error parsing Flipkart product #${index + 1}:`, error.message);
    }
  });

  console.log(`\n✅ Finished parsing Flipkart. Total results: ${results.length}`);
  return results;
};


// Main Flipkart scraping function, reusing the global browser instance
const scrapeFlipkart = async (query, config) => {
  console.log("Starting Flipkart scraping...");
  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

  let products = [];
  let page;

  for (let attempts = 0; attempts < config.retryCount; attempts++) {
    try {
      if (!browserInstance || !browserInstance.isConnected()) {
        console.log("Browser disconnected, re-initializing...");
        browserInstance = await launchBrowser(); // Re-launch if disconnected
      }
      page = await browserInstance.newPage(); // Create a new page from the persistent browser
      await page.setUserAgent(config.userAgent);
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (["stylesheet", "font"].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      console.log(`Attempt ${attempts + 1} to navigate to Flipkart: ${searchUrl}`);
      await page.goto(searchUrl, {
        waitUntil: ['domcontentloaded', 'networkidle0'], // Using 'networkidle0' for potentially faster load
        timeout: config.navigationTimeout,
      });

      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for page to settle

      // Close login popup if exists
      try {
        await page.waitForSelector("._2KpZ6l._2doB4z", { timeout: 5000 }); // Shorter timeout for popup
        await page.click("._2KpZ6l._2doB4z");
        console.log("Closed Flipkart login popup");
        await new Promise(resolve => setTimeout(resolve, 500)); // Shorter delay after closing popup
      } catch (e) {
        console.log("No Flipkart login popup detected or it was handled.");
      }

      await page.waitForSelector("div[data-id]", { timeout: config.waitForSelectorTimeout }); // Main product selector
      await autoScroll(page);
      const content = await page.content();
      const $ = cheerio.load(content);
      products = parseFlipkartProducts($, "div[data-id]", config);
      return products; // Return on success

    } catch (err) {
      console.error(`Error during Flipkart scraping (Attempt ${attempts + 1}/${config.retryCount}):`, err.message);
      if (page && !page.isClosed()) {
        await page.close(); // Close the current page on error
      }
      if (attempts >= config.retryCount - 1) { // If this is the last attempt
          console.error(`Max retries reached for Flipkart. Giving up.`);
          return [];
      }
      // If the browser instance itself seems problematic, force a re-launch for the next retry
      if (err.message.includes('disconnected') || err.message.includes('closed') || err.message.includes('detached')) {
        console.log("Browser instance likely disconnected, forcing re-initialization for next attempt...");
        if (browserInstance && browserInstance.isConnected()) {
          await browserInstance.close();
        }
        browserInstance = null; // Mark for re-initialization
      }
    } finally {
      // Ensure the page is closed after each attempt (successful or failed)
      if (page && !page.isClosed()) {
        await page.close();
      }
    }
  }
  return products; // Return products (could be empty if all attempts failed)
};

// Export only the necessary functions for use in server.js
module.exports = {
    getConfig,
    scrapeFlipkart,
    initializeBrowser // Export the initialization function
};
