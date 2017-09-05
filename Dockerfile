FROM node:7.5.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
COPY package.json /usr/src/app
COPY gulpfile.js /usr/src/app
RUN npm install && npm cache clean
RUN node node_modules/gulp/bin/gulp build
COPY . /usr/src/app

EXPOSE 5000

CMD ["node", "./server/index.js"]
