# Getting started

1. Install `npm`, `yarn` and `docker` however you'd like.
2. `cd server` and install dependencies with `yarn`.
3. Start the database with `yarn db:start`.
4. Install TypeORM with `npm install -g typeorm`.
5. Sync schema with `yarn typeorm schema:sync`.
6. Try starting database with `yarn start`. It should print this:

```bash
yarn run v1.22.4
$ nodemon -w src --ext ts --exec ts-node src/index.ts
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node src/index.ts`
User { id: 123, name: 'User', email: 'aaa@bbb.ccc' }
[ User { id: 123, name: 'User', email: 'aaa@bbb.ccc' } ]
```