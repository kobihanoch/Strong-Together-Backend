FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN npx tsc --noEmit
RUN npm prune --omit=dev

EXPOSE 5000

CMD ["npm", "run", "start:server"]
