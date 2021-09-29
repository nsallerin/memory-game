# Memory Game

## Description

This project is divided into two main parts:
- An `Express` API used to send and retrieve data to/from the database
- A vanillia `Webpack` front-end application which displays and handles the game logic

## Database

The *Postgressql* database is started in a *Docker* container with the configuration set in the `server/docker-compose.yml` file.

Migrations are handled with the `server/database/init.sql` file whose queries are automatically run during the first `docker-compose` launch.

Here are the columns created for the `game` table:

| Field         | Type          
|:------------- |:-------------
| `id`          | `UUID`
| `player`      | `string`
| `time`        | `number`
| `score`       | `string`
| `is_won`      | `boolean`

## Setup

```bash
# Create environment variables files
cp client/.env.sample client/.env
cp server/.env.sample server/.env

# Install Docker
$ brew install docker

# Install dependencies
yarn install
```

## Launch application

```bash
# from src/client
yarn dev

# from src/server
docker-compose up
# another terminal window from src/server
yarn dev
```

It will launch:
- `client` Front-end application on http://localhost:5000
- `server` Back-end application on http://localhost:5100
- `database` in a docker container on http://localhost:5200

## Tests

```bash
# from ./
yarn test
```
