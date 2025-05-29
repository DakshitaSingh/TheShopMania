import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { scrapeAmazonProducts } from './apify.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite frontend
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Apify scraper backend is running.');
});

app.post('/scrape', async (req, res) => {
  const { keyword, taskId } = req.body;

  if (!keyword || !taskId) {
    return res.status(400).json({ error: 'Missing keyword or taskId' });
  }

  try {
    const items = await scrapeAmazonProducts(keyword, taskId);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Scraping failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
