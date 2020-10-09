FROM node:10
WORKDIR /usr/src/app
COPY NodeJSCalismalar /usr/src/app
RUN npm install
CMD npm run start
EXPOSE 3000