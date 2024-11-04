import openai
import json
import logging

api_key = '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'

def sum_news_gpt(article):

    prompt = f"""
              당신은 뉴스 기사를 한 두 문장으로 요약해주는 알고리즘입니다.
              오직 변경된 text만을 출력해주세요. 다른 어떠한 것도 출력되어서는 안됩니다.
              당신의 출력 형식은 한 두줄 이내의 텍스트로, article을 요약하여야 하고, 마약에 관련되어 있어야만 합니다.
              
            
              만약 마약과 관련된 내용이 아닐 경우 뉴스의 제목을 반영한 청년들의 마약 예방에 도움이 구체적인 예방 방안을 알려주세요.
              이 경우 마약 관련된 내용이 포함되어있지 않다는 출력 없이 청년들의 마약 예방에 도움이 구체적인 예방 방안만을 출력하세요. 
              어미는 '-이다'로 끝나야 합니다.
              ----------------------------------
              {article}
              ----------------------------------
              """
    while True:
        try:
            response = openai.chat.completions.create(
                model='gpt-4o-mini',
                messages=[{"role": "system", "content": prompt}],
                temperature=1
            )
            break

        except ValueError:
            logging.exception("message")
            continue
    print(response.choices[0].message.content)
    return response.choices[0].message.content