FROM node:alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG PORT
ENV PORT=$PORT 
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
# ARG BROKER_1
# ENV BROKER_1=$BROKER_1

RUN npm run build

EXPOSE 9051

CMD [ "npm","run","start" ]