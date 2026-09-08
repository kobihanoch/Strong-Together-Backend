FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY packages/shared ./packages/shared
COPY src ./src
RUN npm ci

RUN npx tsc --noEmit
RUN npm prune --omit=dev

EXPOSE 5000

CMD ["npm", "run", "start:server"]
