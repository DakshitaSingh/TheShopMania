from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

# Snapdeal category URLs
SNAPDEAL_CATEGORY_URLS = {
    "men": "https://www.snapdeal.com/products/mens-tshirts-polos?sort=plrty",
    "women": "https://www.snapdeal.com/products/women-apparel-tops-tunics?sort=plrty",
    "kids": "https://www.snapdeal.com/search?keyword=kids%20wear&santizedKeyword=kids%20wear&catId=0&categoryId=524"
}

# Snapdeal scraper
def scrape_snapdeal(url):
    products = []
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
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
            image = (
                image_tag.get('src') or 
                image_tag.get('data-src') or 
                image_tag.get('data-original') or 
                ""
            )
            if image.startswith('//'):
                image = 'https:' + image
            elif image.startswith('/'):
                image = 'https://www.snapdeal.com' + image

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

# ShopClues scraper using search query or category
def scrape_shopclues(query):
    products = []
    try:
        url = f"https://www.shopclues.com/search?q={query}"
        response = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(response.content, "lxml")

        cards = soup.select(".column.col3.search_blocks")[:10]

        for card in cards:
            title_tag = card.find("h2")
            price_tag = card.find("span", class_="p_price")
            image_tag = card.find("img")
            link_tag = card.find("a")

            title = title_tag.text.strip() if title_tag else "No title"
            price = price_tag.text.strip() if price_tag else "No price"

            image_url = (
                image_tag.get('src') or
                image_tag.get('data-img') or
                ""
            )
            if image_url.startswith('//'):
                image_url = 'https:' + image_url
            elif image_url.startswith('/'):
                image_url = 'https://www.shopclues.com' + image_url

            link = link_tag.get("href") if link_tag else ""
            if link.startswith('/'):
                link = 'https://www.shopclues.com' + link

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

@app.route("/api/products/<platform>/<category_or_query>", methods=["GET"])
def get_products(platform, category_or_query):
    if platform == "snapdeal":
        # If category_or_query is a valid category key, use category URLs
        url = SNAPDEAL_CATEGORY_URLS.get(category_or_query.lower())
        if url:
            products = scrape_snapdeal(url)
        else:
            # Otherwise treat category_or_query as search query and construct search URL
            search_url = f"https://www.snapdeal.com/search?keyword={category_or_query}"
            products = scrape_snapdeal(search_url)
        return jsonify(products)
    elif platform == "shopclues":
        # For ShopClues, treat category_or_query as search query always
        products = scrape_shopclues(category_or_query)
        return jsonify(products)
    else:
        return jsonify({"error": "Unsupported platform"}), 400

if __name__ == "__main__":
    app.run(debug=True)
