FROM node:10
WORKDIR /NodeJSCalismalar
COPY package.json /app
RUN npm install
COPY . /NodeJSCalismalar
CMD npm run start
EXPOSE 3000