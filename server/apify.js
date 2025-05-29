// server/apify.js
import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';
dotenv.config();

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

export const scrapeAmazonProducts = async (keyword, actorId) => {
  try {
    const input = {
      categoryUrls: [
        { url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}` }
      ],
      maxItemsPerStartUrl: 10,
    };

    // Call actor and wait for run to finish
    const run = await client.actor(actorId).call(input);

    // Fetch items from the default dataset of the run
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return items;
  } catch (err) {
    console.error("❌ Error scraping products:", err.message);
    throw err;
  }
};
