FROM node:alpine

WORKDIR /usr/app/front
EXPOSE 3000
COPY ./ ./
RUN npm install
RUN npm rebuild node-sass
CMD ["npm", "start"]
