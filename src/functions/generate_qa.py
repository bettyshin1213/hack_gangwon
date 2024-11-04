import pdfplumber
from openai import OpenAI

api_key = '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'

client = OpenAI(api_key=api_key)
import json
from tqdm import tqdm
import time
import numpy as np
from tenacity import retry, stop_after_attempt, wait_exponential

# OpenAI API 키 설정

def extract_text_from_pdf(pdf_path):
    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                        print(text)
                except Exception as e:
                    print(f"페이지 텍스트 추출 중 오류: {e}")
                    continue
        return text
    except Exception as e:
        print(f"PDF 파일 처리 중 오류: {e}")
        return ""

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def generate_single_question(prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert in creating multiple choice questions about drug prevention education."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        timeout=30)  # 30초 타임아웃 설정)
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"API 요청 중 오류: {e}")
        raise

##추가 필요 

def generate_qa(text, num_questions=10):
    prompt_examples = """
    당신은 마약 예방 교육 전문가입니다. 
    주어진 내용을 바탕으로 아래 형식에 맞춰 정확히 4개의 보기가 있는 객관식 문제를 만들어주세요.

    반드시 다음 형식을 지켜주세요:
    질문
    1) 첫 번째 보기
    2) 두 번째 보기
    3) 세 번째 보기
    4) 네 번째 보기
    정답: (1~4 중 하나의 숫자만 입력)

    예시:
    대마초의 어떤 성분이 환각과 중독을 유발하나요?
    1) LSD
    2) CBD
    3) THC
    4) MDMA
    정답: 3

    다음중 의료용 마약류에 해당하지 않는 것은?
    1) 졸피뎀과 같은 진정수면제
    2) LSD와 같은 환각제
    3) 식욕억제제 및 비만치료제(펜터민)
    4) 날부핀과 같은 진통제
    정답: 2
    """

    if not text.strip():
        raise ValueError("추출된 텍스트가 비어있습니다.")

    text_chunks = [text[i:i+3000] for i in range(0, len(text), 3000)]
    questions = []

    for i in tqdm(range(num_questions), desc="Generating questions"):
        try:
            chunk = np.random.choice(text_chunks)
            prompt = (f"{prompt_examples}\n\n"
                     f"위 형식을 정확히 따라서 새로운 문제를 하나만 만들어주세요. "
                     f"반드시 4개의 보기와 1~4 사이의 숫자로 된 정답을 포함해야 합니다.\n\n"
                     f"다음 내용을 바탕으로 문제를 만들어주세요:\n{chunk}")

            question_text = generate_single_question(prompt)

            # 응답 파싱 개선
            lines = [line.strip() for line in question_text.split('\n') if line.strip()]
            if len(lines) != 6:  # 질문 1줄 + 보기 4줄 + 정답 1줄 = 6줄
                print(f"Invalid response format. Expected 6 lines, got {len(lines)}")
                continue

            question = lines[0]
            options = []
            for j in range(1, 5):
                if not lines[j].startswith(f"{j})"):
                    print(f"Invalid option format: {lines[j]}")
                    continue
                option = lines[j].split(')', 1)[1].strip()
                options.append(option)

            answer = lines[5].replace("정답:", "").strip()

            if len(options) != 4 or not answer.isdigit() or int(answer) not in range(1, 5):
                print("Invalid question format")
                continue

            question_data = {
                "question": question,
                "options": options,
                "answer": answer
            }

            questions.append(question_data)

            print(f"\n문제 {len(questions)}:")
            print(f"질문: {question_data['question']}")
            for idx, option in enumerate(question_data['options'], 1):
                print(f"{idx}) {option}")
            print(f"정답: {question_data['answer']}")
            print("-" * 50)

            time.sleep(1)

        except Exception as e:
            print(f"문제 생성 중 오류: {e}")
            time.sleep(2)
            continue

    with open('mcq_questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=4)

    return questions


if __name__ == "__main__":
    try:
        pdf_path = 'highschooler.pdf'
        print("PDF 파일 읽는 중...")
        pdf_text = extract_text_from_pdf(pdf_path)

        if not pdf_text:
            raise ValueError("PDF에서 텍스트를 추출할 수 없습니다.")

        print("문제 생성 시작...")
        questions = generate_qa(pdf_text, num_questions=50)

        print("\n=== 생성 완료 ===")
        print(f"총 {len(questions)}개의 문제가 생성되었습니다.")
        print(f"결과가 'mcq_questions.json' 파일에 저장되었습니다.")

    except Exception as e:
        print(f"Error in main execution: {e}")