FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /app/certs \
    && cp /app/global-bundle.pem /app/certs/global-bundle.pem

EXPOSE 3000

CMD ["node", "src/server.js"]
