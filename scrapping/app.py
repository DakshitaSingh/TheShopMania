from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import random
import time

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

HEADERS_LIST = [
    # Rotate between a few user‑agents
    {'User-Agent': 'Mozilla/5.0 ... Chrome/113.0'},
    {'User-Agent': 'Mozilla/5.0 ... Firefox/117.0'},
    # Add more...
]

def safe_get(url):
    for attempt in range(3):
        headers = random.choice(HEADERS_LIST)
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                time.sleep(random.uniform(1, 2))
                return resp
        except requests.RequestException:
            time.sleep(2 ** attempt)
    return None

# Snapdeal scraper using search query
def scrape_snapdeal(query):
    products = []
    try:
        search_query = query.replace(' ', '%20')
        url = f"https://www.snapdeal.com/search?keyword={search_query}&sort=plrty"
        res = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.content, "lxml")
        cards = soup.find_all("div", class_="product-tuple-listing", limit=40)

        for card in cards:
            title = card.find('p', class_='product-title').text.strip() if card.find('p', class_='product-title') else ''
            price = card.find('span', class_='lfloat product-price').text.strip() if card.find('span', class_='lfloat product-price') else ''
            href = card.find('a', class_='dp-widget-link')['href'] if card.find('a', class_='dp-widget-link') else ''
            link = "https://www.snapdeal.com" + href if href.startswith('/') else href
            rating_tag = card.find('div', class_='filled-stars')
            if rating_tag and 'style' in rating_tag.attrs:
                width = rating_tag['style'].replace('width:', '').replace('%', '').strip()
                rating = round(float(width) / 20, 1)
            else:
                rating = 'No rating'
            image_tag = card.find('img')
            image = image_tag.get('src') or image_tag.get('data-src') or image_tag.get('data-original') or ''

            products.append({
                "title": title,
                "price": price,
                "link": link,
                "rating": rating,
                "image_url": image,
                "platform": "Snapdeal"
            })
    except Exception as e:
        print("Snapdeal search error:", e)
    return products

# ShopClues scraper using search query
def scrape_shopclues(query):
    products = []
    try:
        url = f"https://www.shopclues.com/search?q={query}"
        response = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(response.content, "lxml")

        cards = soup.select(".column.col3.search_blocks")[:40]

        for card in cards:
            title_tag = card.find("h2")
            price_tag = card.find("span", class_="p_price")
            image_tag = card.find("img")
            link_tag = card.find("a")

            title = title_tag.text.strip() if title_tag else "No title"
            price = price_tag.text.strip() if price_tag else "No price"
            image_url = image_tag.get("data-img") or image_tag.get("src") if image_tag else ""
            link = link_tag.get("href") if link_tag else ""

            if title and link:
                products.append({
                    "title": title,
                    "price": price,
                    "link": link,
                    "rating": "No rating",
                    "image_url": image_url,
                    "platform": "ShopClues"
                })

    except Exception as e:
        print("ShopClues scraping error:", e)

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