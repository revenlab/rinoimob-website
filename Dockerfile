FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN addgroup -S rinoimob && adduser -S rinoimob -G rinoimob

COPY --from=build /app/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

USER rinoimob

CMD ["node", ".output/server/index.mjs"]
