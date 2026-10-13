FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN apk add --no-cache ca-certificates curl \
    && mkdir -p /app/certs \
    && curl -fsSL \
       https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
       -o /app/certs/global-bundle.pem \
    && test -s /app/certs/global-bundle.pem

ENV NODE_EXTRA_CA_CERTS=/app/certs/global-bundle.pem

EXPOSE 3000

CMD ["node", "src/server.js"]
