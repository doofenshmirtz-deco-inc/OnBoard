# TODO typeorm seeding not working
#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:12.13.0

WORKDIR /usr/src/server

COPY .npmrc ./
COPY .yarnrc ./

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY ormconfig.js ./
COPY firebase-admin.json ./
COPY ./src ./src
RUN yarn && yarn build

EXPOSE 5000
CMD ["yarn", "prod"]
