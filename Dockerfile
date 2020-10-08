FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /appr
CMD npm run start
EXPOSE 3000