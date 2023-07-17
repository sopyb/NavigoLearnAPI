# Navigo Learn API

![Build Status](https://github.com/navigolearn/api/actions/workflows/test.yml/badge.svg)

## ! This is a work in progress !

### ! Expect breaking changes !

#### Especially database related stuff

##### and the api itself...

## About

REST api for NavigoLearning. This project is built with Node.js, Express, and
MariaDB.

## Documentation

Documentation for the api can be found [here](docs/paths/README.md).

# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/en/) - v16 or higher
- [MariaDB](https://mariadb.org/) - v10.6 or higher
- [Git](https://git-scm.com/) - v2.32 or higher

## Installation

1. Clone the repo
   ```sh
   git clone git@github.com:NavigoLearn/API.git
   ```

2. Install NPM packages
   ```sh
   npm install
   ```

3. Create a MariaDB database
    ```sh
    CREATE DATABASE navigo_learn;
       USE navigo_learn;
    CREATE USER 'navigo_learn'@'localhost' IDENTIFIED BY 'password';
     GRANT ALL PRIVILEGES ON navigo_learn.* TO 'navigo_learn'@'localhost';
    ```

4. Rename the env.example folder to env and fill in the values for
   development.env

5. Run tests to make sure everything works
    ```sh
    npm test
   ```

6. Run the server
   ```sh
   npm run dev
   ```

## Structure of the Project

The project is split into 4 main folders:

- `src` - Contains all the source code for the project.
- `spec` - Contains all the unit-tests for the project.
- `docs` - Contains all the documentation for the project.
- `env` - Contains all the environment files for the project. (rename the
  env.example folder to env to use it)

### `src`

The `src` folder is split into multiple main folders:

- `constants` - Contains constants used in the project. (HTTP status codes, env
  variables, etc.)
- `controllers` - Contains the controllers of the project.
- `middleware` - Contains middleware used in the project. (session, etc.)
- `models` - Contains the data models for the project. (Roadmap, User, etc.)
- `routes` - Contains the routers pointing to controllers. (auth, users, etc.)
- `sql` - Contains sql files used in the project. (create tables, metrics, etc.)
- `utils` - Contains utility functions used in the project. (databaseDriver,
  etc.)
- `validators` - Contains the validators used in the project. (user, roadmap,
  etc.)
- `index.ts` - The entry point.
- `server.ts` - The server.
