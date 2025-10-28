FROM node:20-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache dos2unix
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN dos2unix ./start.sh && sed -i "1s/^\xEF\xBB\xBF//" ./start.sh && chmod +x ./start.sh
EXPOSE 5000
CMD ["./start.sh"]
