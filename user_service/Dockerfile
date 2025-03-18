FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG PORT 
ENV PORT=$PORT
ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

RUN npm run build

EXPOSE 9050

CMD [ "npm", "run","start" ]