from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import random
import time
import re # Import the regular expressions module

app = Flask(__name__)
# Be more specific with CORS in production if possible, but "*" is fine for this project
CORS(app, resources={r"/api/*": {"origins": "*"}})

# A more extensive list of real-world user agents
HEADERS_LIST = [
    {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'},
    {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0'},
    {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'},
    {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15'},
    {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'}
]

def safe_get(url):
    """
    Makes a GET request with rotating user-agents and exponential backoff.
    This is crucial for avoiding being blocked by e-commerce sites.
    """
    for attempt in range(3):
        headers = random.choice(HEADERS_LIST)
        try:
            # Set a reasonable timeout
            resp = requests.get(url, headers=headers, timeout=15)
            # Check for successful status codes
            if resp.status_code == 200:
                # Add a small, random delay to mimic human behavior
                time.sleep(random.uniform(1, 3))
                return resp
            # If we are blocked, wait and retry
            elif resp.status_code == 403 or resp.status_code == 429:
                print(f"Request blocked with status {resp.status_code}, retrying...")
                time.sleep(2 ** attempt + random.uniform(0, 1))
            else:
                # For other errors, maybe we don't retry
                print(f"Request failed with status {resp.status_code}, not retrying.")
                return None
        except requests.RequestException as e:
            print(f"Request exception: {e}, retrying...")
            time.sleep(2 ** attempt + random.uniform(0, 1))
    print(f"All 3 attempts failed for URL: {url}")
    return None

# Snapdeal scraper using search query
def scrape_snapdeal(query):
    products = []
    try:
        search_query = query.replace(' ', '%20')
        url = f"https://www.snapdeal.com/search?keyword={search_query}&sort=plrty"
        
        # Use the safe_get function
        res = safe_get(url)
        if not res:
            print("Snapdeal: Failed to retrieve page.")
            return []

        soup = BeautifulSoup(res.content, "lxml")
        cards = soup.find_all("div", class_="product-tuple-listing", limit=40)

        for card in cards:
            title = card.find('p', class_='product-title').text.strip() if card.find('p', class_='product-title') else ''
            
            price_tag = card.find('span', class_='lfloat product-price')
            price = price_tag.text.strip() if price_tag else 'Not available'

            href_tag = card.find('a', class_='dp-widget-link')
            link = href_tag['href'] if href_tag and href_tag.has_attr('href') else ''
            
            rating_tag = card.find('div', class_='filled-stars')
            rating = 'No rating'
            if rating_tag and 'style' in rating_tag.attrs:
                width_match = re.search(r'width:\s*(\d+\.?\d*)%', rating_tag['style'])
                if width_match:
                    width = float(width_match.group(1))
                    rating = round(width / 20, 1)

            image_tag = card.find('img', class_='product-image')
            image = image_tag.get('data-src') or image_tag.get('src') if image_tag else ''
            
            if title and link:
                products.append({
                    "title": title,
                    "price": price,
                    "link": link,
                    "rating": rating,
                    "image_url": image,
                    "platform": "Snapdeal"
                })
    except Exception as e:
        print(f"Snapdeal search error: {e}")
    return products

# ShopClues scraper using search query
def scrape_shopclues(query):
    products = []
    try:
        search_query = query.replace(' ', '+')
        url = f"https://www.shopclues.com/search?q={search_query}"
        
        # Use the safe_get function
        response = safe_get(url)
        if not response:
            print("ShopClues: Failed to retrieve page.")
            return []

        soup = BeautifulSoup(response.content, "lxml")
        
        # *** REVERTED TO ORIGINAL SELECTOR AS REQUESTED ***
        cards = soup.select(".column.col3.search_blocks")[:40]

        for card in cards:
            title_tag = card.find("h2")
            price_tag = card.find("span", class_="p_price")
            image_tag = card.find("img")
            link_tag = card.find("a")

            title = title_tag.text.strip() if title_tag else "No title"
            price = price_tag.text.strip() if price_tag else "No price"
            image_url = image_tag.get("data-img") or image_tag.get("src") if image_tag else ""
            link = link_tag.get("href") if link_tag and link_tag.has_attr('href') else ""
            if link.startswith('//'):
                link = 'https:' + link

            if title and link:
                products.append({
                    "title": title,
                    "price": price,
                    "link": link,
                    "rating": "No rating", # Shopclues doesn't show rating on the search page
                    "image_url": image_url,
                    "platform": "ShopClues"
                })

    except Exception as e:
        print(f"ShopClues scraping error: {e}")

    return products

# Combined route for Snapdeal and ShopClues using search
@app.route("/api/products/<platform>/<query>", methods=["GET"])
def get_products(platform, query):
    if platform == "snapdeal":
        return jsonify(scrape_snapdeal(query))
    elif platform == "shopclues":
        return jsonify(scrape_shopclues(query))
    else:
        return jsonify({"error": "Invalid platform"}), 400

if __name__ == "__main__":
    app.run(debug=True)