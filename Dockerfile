FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN apk add --no-cache curl

EXPOSE 5000

RUN chmod +x ./start.sh

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://localhost:${PORT:-5000}/health || exit 1

CMD ["./start.sh"]
