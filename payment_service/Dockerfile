FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ARG PORT
ENV PORT=$PORT

RUN npm run build

EXPOSE 9052

CMD [ "npm","run","start" ]