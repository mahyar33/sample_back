FROM node:10
WORKDIR /sample
COPY package.json /sample
RUN npm install
COPY . /sample
CMD npm start
EXPOSE 8080