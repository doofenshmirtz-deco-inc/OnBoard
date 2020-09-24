# TODO typeorm seeding not working
#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:12.13.0

WORKDIR /usr/src/client

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY ./src ./src
COPY ./public ./public
RUN yarn && yarn build
