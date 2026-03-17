FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./tsconfig.json
COPY src ./src

EXPOSE 5000

CMD ["npm", "run", "start:server"]
