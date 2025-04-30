# 1. Node.js 공식 이미지 사용
FROM node:20

# 2. 작업 디렉토리 만들기
WORKDIR /app

# 3. package.json, package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 + data 폴더까지 복사
COPY . .

# 6. 포트 열기
EXPOSE 3000

# 7. 서버 실행
CMD ["node", "server.js"]
