FROM node:7.5.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
COPY ["package.json","gulpfile.js","jshint.rc","/usr/src/app/"]
COPY "server" "/usr/src/app/server/"
COPY "client" "/usr/src/app/client/"
RUN npm install && npm cache clean
RUN node node_modules/gulp/bin/gulp build

EXPOSE 5000

CMD ["node", "./server/index.js"]
