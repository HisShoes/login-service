FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 8080

CMD ["nodemon", "-L", "index.js"]