# base image
#FROM node:14.19.1-alpine
FROM node:18-alpine
# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install and cache app dependencies
#COPY package.json /usr/src/app/package.json
COPY package*.json ./
# RUN yarn install
RUN yarn install

ENV PATH /usr/src/app/node_modules/.bin:$PATH
WORKDIR /usr/src/app/src

COPY . .

# Bundle app source
# COPY . /usr/src/app

EXPOSE 3000
# start app
CMD ["npm", "run", "start"]

# Build App Image
# docker build . -t tranit/rsaf-transport-portal-reactjs

# Run and start App from terminal
# docker run -it -p 3000:3000 -v `pwd`/:/usr/src/app/src tranit/rsaf-transport-portal-reactjs

# Login to container
# docker exec -it <container-id> sh
