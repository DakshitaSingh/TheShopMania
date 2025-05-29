import requests
from bs4 import BeautifulSoup

url="https://www.flipkart.com/"
r=requests.get(url)
print(r)

