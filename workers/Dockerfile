FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY packages/shared ./packages/shared
COPY src ./src
RUN npm ci

COPY workers ./workers

RUN npx tsc --noEmit
RUN npm prune --omit=dev

CMD ["npm", "run", "start:workers"]
