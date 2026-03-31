FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY workers ./workers

RUN npx tsc --noEmit
RUN npm prune --omit=dev

CMD ["npm", "run", "start:workers"]
