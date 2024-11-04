import requests
from bs4 import BeautifulSoup

def link_to_text(url):

    # 페이지 HTML 가져오기
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'}
    response = requests.get(url, headers=headers)

    # HTML 파싱
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 제목 추출
    title_elem = soup.select_one('#title_area > span')
    if not title_elem:
        title_elem = soup.select_one('.media_end_head_headline')

    title = title_elem.get_text(strip=True) if title_elem else None

    # #dic_area 내부의 텍스트 추출, img_desc 클래스 내용 제외
    dic_area = soup.find(id='dic_area')
    if dic_area:
        # 태그로 감싸지지 않은 텍스트만 추출
        plain_texts = [string for string in dic_area.strings if string.strip()]
        
        image_elem = soup.find(id='img1')

        if not image_elem:
            image_url = None
        else:
            image_url = image_elem.get('data-src')

        # img_desc를 제외한 나머지 텍스트 가져오기
        return {'title': title, 'content': ''.join(plain_texts), 'image_url': image_url}
    else:
        return None