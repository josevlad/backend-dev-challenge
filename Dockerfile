FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm i --omit=dev
COPY . /usr/src/app
RUN ls -la /usr/src/app
RUN rm /usr/src/app/.env
EXPOSE 8081
CMD ["npm", "start"]