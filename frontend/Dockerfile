FROM node:alpine

WORKDIR /usr/app/front
COPY ./ ./
RUN npm install --silent
RUN npm rebuild node-sass
EXPOSE 3000
CMD ["npm", "start"]
