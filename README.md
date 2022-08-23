# Building web application without ORM
This repo contains an article and example code on the topic

## Read an article
Please, I will be delighted :) [./article.md]

## Check the code
All of the code sits in `src` directory

## Run the application
Add postgres connection variables to the `.env` in the root directory. You can use [Neon](https://neon.tech/) or [docker](https://hub.docker.com/_/postgres) for a quick postgres setup.

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
