FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY workers ./workers

CMD ["npm", "run", "start:workers"]
