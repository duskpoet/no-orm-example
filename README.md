# Building web application without ORM
This repo contains an article and example code on the topic

## Read an article
Please, I will be delighted :) [link](./article.md)

## Check the code
All of the code sits in `src` directory

## Run the application
Add connection string to the `.env` like `DATABASE_URL=<connection string>` in the root directory. You can use [Neon](https://neon.tech/) or [docker](https://hub.docker.com/_/postgres) for a quick postgres setup.

```
yarn && yarn migrate && yarn start
```

```
curl https://localhost:3000/users
```

## Run tests
```
yarn test
```

## Share your thoughts
[Discuss](https://github.com/duskpoet/no-orm-example/discussions/1)
