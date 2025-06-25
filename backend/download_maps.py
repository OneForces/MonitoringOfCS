import os
import requests
from bs4 import BeautifulSoup

url = "http://cs-monitor.su/maps/cs16/"
save_dir = "cs16_maps"
os.makedirs(save_dir, exist_ok=True)

response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

image_tags = soup.find_all("img")

for tag in image_tags:
    src = tag.get("src")
    if src and (src.endswith(".jpg") or src.endswith(".png")):
        full_url = src if src.startswith("http") else f"http://cs-monitor.su{src}"
        img_name = os.path.basename(full_url)
        img_data = requests.get(full_url).content
        with open(os.path.join(save_dir, img_name), 'wb') as f:
            f.write(img_data)
        print(f"Скачано: {img_name}")
