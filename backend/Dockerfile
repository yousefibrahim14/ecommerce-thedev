
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY certs/global-bundle.pem ./certs/global-bundle.pem

EXPOSE 3000

CMD ["node", "src/server.js"]
