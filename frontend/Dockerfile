FROM node:alpine

WORKDIR /usr/app/front
COPY ./ ./
RUN npm install
RUN npm rebuild node-sass
EXPOSE 3000
CMD ["npm", "start"]
