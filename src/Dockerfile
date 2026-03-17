FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000

CMD ["node", "src/index.js"]
