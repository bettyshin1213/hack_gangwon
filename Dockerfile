# Node.js 베이스 이미지 설정 (버전 14 사용)
FROM node:14

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 컨테이너로 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션의 모든 소스 파일을 복사
COPY . .

# React 애플리케이션이 사용하는 기본 포트 3000 노출
EXPOSE 3000

# React 개발 서버 실행
CMD ["npm", "start"]
