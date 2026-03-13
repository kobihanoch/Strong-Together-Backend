FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src
COPY workers ./workers

CMD ["node", "workers/globalWorker.js"]
