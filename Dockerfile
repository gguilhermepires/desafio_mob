FROM node:17-alpine3.14

WORKDIR /app
COPY . ./
COPY package.json ./
COPY .env ./
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn install
RUN apk update && apk add bash
