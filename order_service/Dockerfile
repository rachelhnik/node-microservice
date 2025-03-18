FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ARG PORT
ARG DATABASE_URL
ENV PORT=$PORT
ENV DATABASE_URL=$DATABASE_URL

RUN npm run build

EXPOSE 9052

CMD [ "npm","run","start" ]