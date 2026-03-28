const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

// A simple utility function to add a delay if needed
const delay = ms => new Promise(res => setTimeout(res, ms));

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query is missing' });
    
    try {
        console.log(`[API] Searching for: ${query}`);
        // Fetch HTML from Flipkart
        const { data } = await axios.get(`https://www.flipkart.com/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        });
        
        const $ = cheerio.load(data);
        const products = [];
        
        // Flipkart items usually have 'data-id'
        $('[data-id]').each((index, element) => {
            if (products.length >= 15) return; // Limit to 15 items
            
            // Extract link
            let link = $(element).find('a').attr('href');
            if (link && !link.startsWith('http')) {
                link = 'https://www.flipkart.com' + link;
            }
            
            // Extract image
            let image = $(element).find('img').attr('src');
            if (image && image.includes('data:image/svg')) {
                // Sometime flipkart uses lazy loading, the real image is in another attribute
                let maybeRealImg = $(element).find('img').attr('data-src') || $(element).img;
                // Just fallback if possible, usually they place the image right away for SEO on first load
            }

            // Extract title
            let title = $(element).find('img').attr('alt');
            if (!title) {
                // If alt is missing, try to find a div containing text that looks like a title
                const allTexts = [];
                $(element).find('div, a').each((_, el) => {
                    const text = $(el).text().trim();
                    if (text && text.length > 20 && !text.includes('₹') && !text.includes('Reviews')) {
                        allTexts.push(text);
                    }
                });
                if (allTexts.length > 0) {
                    title = allTexts[0];
                } else {
                    title = "Product";
                }
            }
            
            // Extract price
            // Find all elements ending with or containing ₹
            let price = 'N/A';
            $(element).find('div').each((_, el) => {
                const text = $(el).text();
                // Check if text matches the ₹1,999 format precisely
                const match = text.match(/^₹[\d,]+$/);
                if (match) {
                    price = match[0];
                }
            });
            // Fallback for price extraction
            if (price === 'N/A') {
                const anyPriceMatch = $(element).text().match(/₹[\d,]+/);
                if (anyPriceMatch) {
                    price = anyPriceMatch[0];
                }
            }
            
            // Only add if we have some meaningful data
            if (image && !image.includes('data:image/svg') && title) {
                products.push({
                    id: $(element).attr('data-id'),
                    title: title.trim(),
                    brand: 'LiveSearch',
                    price: price,
                    image: image,
                    link: link || `https://www.flipkart.com/search?q=${query}`,
                    source: 'Flipkart'
                });
            }
        });

        console.log(`[API] Found ${products.length} products`);
        res.json(products);
    } catch (error) {
        console.error("[API] Scraping error:", error.message);
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Meta-Search backend running on http://localhost:${PORT}`));
