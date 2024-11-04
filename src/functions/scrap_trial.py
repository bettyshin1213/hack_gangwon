import requests
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
import openai as client
import json
from tqdm import tqdm
from news_sum import sum_news_gpt

# Set up OpenAI API Key
client.api_key = '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'

def make_urls(search, max_pages=1):
    urls = []
    for i in range(max_pages):
        start = i * 10 + 1
        url = f"https://search.naver.com/search.naver?where=news&sm=tab_pge&query={search}&start={start}"
        urls.append(url)
    return urls

def extract_article_urls(page_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102",
    }
    response = requests.get(page_url, headers=headers)
    html = BeautifulSoup(response.text, "html.parser")
    url_naver = html.select("div.group_news > ul.list_news > li div.news_area > div.news_info > div.info_group > a.info")
    return [a["href"] for a in url_naver if "news.naver.com" in a["href"]]

def summarize_article(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Fetch all paragraphs
    content = " ".join([p.get_text() for p in soup.find_all("p")])

    # Generate summary with GPT
    summary = sum_news_gpt(content) if content else "No content available"
    title = soup.select_one('.media_end_head_headline').get_text(strip=True) if soup.select_one('.media_end_head_headline') else "No title"
    return title, summary, url

def crawl_articles(urls):
    articles = []
    
    for url in tqdm(urls):
        title, summary, article_url = summarize_article(url)
        
        articles.append({
            'title': title,
            'summary': summary,
            'url': article_url
        })

    return pd.DataFrame(articles)

def recsys_news(search_keywords):
    final_df = pd.DataFrame(columns=['title', 'summary', 'url'])

    for keyword in search_keywords:
        page_urls = make_urls(keyword, max_pages=1)
        all_article_urls = []

        for page_url in page_urls:
            article_urls = extract_article_urls(page_url)
            all_article_urls.extend(article_urls)

        articles_df = crawl_articles(all_article_urls)
        final_df = pd.concat([final_df, articles_df], ignore_index=True)

    # Output JSON
    json_data = final_df.to_dict(orient="records")
    return json_data

def generate_news_data():
    json_data = recsys_news(["마약신종수법"])
    with open('newsData.json', 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    generate_news_data()