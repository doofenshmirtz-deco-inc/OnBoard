# TODO typeorm seeding not working
#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:12.13.0

WORKDIR /usr/src/app

COPY .npmrc ./
COPY .yarnrc ./

COPY package.json ./
COPY tsconfig.json ./
COPY ormconfig.json ./
COPY ./src ./src
RUN ls
RUN yarn && yarn build

EXPOSE 5000
CMD ["yarn", "prod"]
