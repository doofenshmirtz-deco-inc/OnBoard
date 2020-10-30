# OnBoard Server

This is the backend for OnBoard, making use of typeorm, GraphQL, express, and
Apollo.

## Getting started

1. Install `npm`, `yarn` and `docker` however you'd like (see below for WSL).
2. `cd server` and install dependencies with `yarn`.
3. Start the database with `yarn db:start`.
4. Sync schema with `yarn typeorm schema:sync`.
5. Seed the database with `yarn db:seed`.
6. Start the supporting docker containers with `yarn docker:up`.
7. Start the backend server with `yarn start`. It should print this:

```bash
yarn run v1.22.4
$ nodemon -w src --ext ts --exec ts-node src/index.ts
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node src/index.ts`
```

## Windows Installation

To set this up on Windows (via WSL), you will need to install the preqreuisite
tools using these instructions.

1. Set up WSL 2 (version 2 is very important).
2. Install Docker from the [official instructions](https://docs.docker.com/engine/install/ubuntu/).
3. Update apt packages with `sudo apt update`.
4. Install apt packages with `sudo apt install nodejs npm docker-compose`.
5. Install required node packages with `sudo npm i -g yarn ts-node`.
6. Follow the Getting Started instructions above.

## Project Structure

- The entry point for the server is at index.tsx.
- The database utilities are defined in the db/ folder. 
Subfolders include factories/ which generate test data for each model, and
seeds which seed data for testing purposes.
- Database models are located in models/. These are defined with typeorm and
define GraphQL fields and types.
- Server middleware is located in middleware/, such as checking auth and context.
- GraphQL resolvers are in resolvers/. These define the queries, mutations, and 
subscriptions for GraphQL while interacting with the database.
- Tests are located in tests/. These ensure the mutations and database work
correctly.
- Docker configurations are located in the various compose-\*.yml to set up
services.
