
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY global-bundle.pem ./certs/global-bundle.pem

ENV NODE_EXTRA_CA_CERTS=/app/certs/global-bundle.pem

EXPOSE 3000

CMD ["node", "src/server.js"]

