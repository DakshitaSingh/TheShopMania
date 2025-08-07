// scrapping.js
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const launchBrowser = require('./chrome');

let browserInstance = null;

const getConfig = () => ({
    maxProducts: 40, // Let's try to get a few more products now that scroll works
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    navigationTimeout: 60000,
    waitForSelectorTimeout: 20000,
    retryCount: 2
});

const initializeBrowser = async () => {
    if (!browserInstance || !browserInstance.isConnected()) {
        console.log("Launching new persistent browser instance...");
        browserInstance = await launchBrowser();
    }
    return browserInstance;
};

// =================================================================
// START: THE DEFINITIVE autoScroll FUNCTION FOR INFINITE SCROLL
// =================================================================
const autoScroll = async (page) => {
    console.log("Scrolling the page intelligently to load all products...");
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            let previousHeight = -1;
            let scrollAttempts = 0;

            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                scrollAttempts++;

                // If the scroll height hasn't changed after a few scrolls, we're done
                if (scrollHeight === previousHeight || scrollAttempts > 100) {
                    clearInterval(timer);
                    resolve();
                } else {
                    previousHeight = scrollHeight;
                }
            }, 300); // Slower interval to give the page time to load new content
        });
    });
    console.log("Finished intelligent scrolling.");
};
// =================================================================
// END: NEW autoScroll FUNCTION
// =================================================================


// =================================================================
// FLIPKART LOGIC (Unchanged)
// =================================================================
const parseFlipkartProducts = ($, config) => {
    const results = [];
    $("div._4ddWXP").each((index, el) => {
        if (results.length >= config.maxProducts) return false;
        try {
            const linkTag = $(el).find("a.s1Q9rs");
            const relativeLink = linkTag.attr("href");
            const link = relativeLink ? `https://www.flipkart.com${relativeLink}` : "";
            const image_url = $(el).find("img._396cs4").attr("src");
            const brand = $(el).find("div._2WkVRV").text().trim();
            const titleText = linkTag.text().trim();
            const title = `${brand} - ${titleText}`;
            const priceText = $(el).find("div._30jeq3").text().replace(/[₹,]/g, "").trim();
            const price = parseInt(priceText, 10);
            if (title && price > 0) {
                results.push({ title, image_url, link, price: `₹${price}`, platform: "Flipkart" });
            }
        } catch (error) {
             console.error(`❗ Error parsing Flipkart product #${index + 1}:`, error.message);
        }
    });
    console.log(`✅ Finished parsing Flipkart. Total results: ${results.length}`);
    return results;
};

const scrapeFlipkart = async (query, config) => {
    console.log(`Starting scrape for: Flipkart, Query: ${query}`);
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    let page;
    try {
        if (!browserInstance || !browserInstance.isConnected()) {
            browserInstance = await launchBrowser();
        }
        page = await browserInstance.newPage();
        await page.setUserAgent(config.userAgent);
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: config.navigationTimeout });
        const selector = "div._4ddWXP";
        await page.waitForSelector(selector, { timeout: config.waitForSelectorTimeout });
        await autoScroll(page);
        await page.waitForTimeout(2000); // Extra wait for last images to settle
        const content = await page.content();
        const $ = cheerio.load(content);
        return parseFlipkartProducts($, config);
    } catch (err) {
        console.error(`Error scraping Flipkart:`, err.message);
        return [];
    } finally {
        if (page && !page.isClosed()) await page.close();
    }
};

// =================================================================
// MYNTRA LOGIC
// =================================================================
const parseMyntraProducts = ($, config) => {
    const results = [];
    $("li.product-base").each((index, el) => {
        if (results.length >= config.maxProducts) return false;
        const link = $(el).find("a").attr("href");
        const image_url = $(el).find("picture.img-responsive img").attr("src");
        const brand = $(el).find(".product-brand").text().trim();
        const description = $(el).find(".product-product").text().trim();
        const title = `${brand} - ${description}`;
        const priceText = $(el).find(".product-discountedPrice").text().replace(/[₹,Rs. ]/g, "").trim() || $(el).find(".product-price span").text().replace(/[₹,Rs. ]/g, "").trim();
        const price = parseInt(priceText, 10);
        if (title && price > 0) {
            results.push({ title, image_url, link: `https://www.myntra.com${link}`, price: `₹${price}`, platform: "Myntra" });
        }
    });
    console.log(`✅ Finished parsing Myntra. Total results: ${results.length}`);
    return results;
};

const scrapeMyntra = async (query, config) => {
    console.log(`Starting scrape for: Myntra, Query: ${query}`);
    const searchUrl = `https://www.myntra.com/${encodeURIComponent(query)}`;
    let page;
    try {
        if (!browserInstance || !browserInstance.isConnected()) {
            browserInstance = await launchBrowser();
        }
        page = await browserInstance.newPage();
        await page.setUserAgent(config.userAgent);
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: config.navigationTimeout });
        await page.waitForSelector("li.product-base", { timeout: config.waitForSelectorTimeout });
        
        // Use the new, intelligent scroll function
        await autoScroll(page);
        
        // Add a small, final wait for the very last images to finish loading
        await page.waitForTimeout(2000); 

        const content = await page.content();
        const $ = cheerio.load(content);
        return parseMyntraProducts($, config);
    } catch (err) {
        console.error(`Error scraping Myntra:`, err.message);
        return [];
    } finally {
        if (page && !page.isClosed()) await page.close();
    }
};

module.exports = {
    getConfig,
    scrapeFlipkart,
    scrapeMyntra,
    initializeBrowser
};