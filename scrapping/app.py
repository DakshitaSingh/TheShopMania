from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

CATEGORY_URLS = {
    "men": "https://www.snapdeal.com/products/mens-tshirts-polos?sort=plrty",
    "women": "https://www.snapdeal.com/products/women-apparel-tops-tunics?sort=plrty",
    "kids": "https://www.snapdeal.com/search?keyword=kids%20wear&santizedKeyword=kids%20wear&catId=0&categoryId=524"
}

def scrape_snapdeal(url):
    products = []
    try:
        res = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(res.content, "lxml")
        cards = soup.find_all("div", class_="product-tuple-listing", limit=10)
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
        print("Snapdeal error:", e)
    return products

@app.route("/api/products/<category>", methods=["GET"])
def get_snapdeal_products(category):
    if category not in CATEGORY_URLS:
        return jsonify({"error": "Invalid category"}), 400

    url = CATEGORY_URLS[category]
    products = scrape_snapdeal(url)
    return jsonify(products)

if __name__ == "__main__":
    app.run(debug=True)
