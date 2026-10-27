
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && mkdir -p /app/certs \
    && curl -fsSL \
       https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
       -o /app/certs/global-bundle.pem \
    && test -s /app/certs/global-bundle.pem \
    && apt-get purge -y --auto-remove curl \
    && rm -rf /var/lib/apt/lists/*

COPY src/ ./src/

ENV NODE_EXTRA_CA_CERTS=/app/certs/global-bundle.pem

EXPOSE 3000

CMD ["node", "src/server.js"]

