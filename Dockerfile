FROM node:18.16.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "nodemon", "server.js" ]