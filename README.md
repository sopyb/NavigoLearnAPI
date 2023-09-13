# NavigoLearn API

| Build Status |                                                  Badge                                                   |
|:------------:|:--------------------------------------------------------------------------------------------------------:|
|  Production  |   ![Build Status](https://github.com/navigolearn/api/actions/workflows/test.yml/badge.svg?branch=prod)   |
|    Master    |  ![Build Status](https://github.com/navigolearn/api/actions/workflows/test.yml/badge.svg?branch=master)  |

## ! This is a work in progress !

### ! Expect breaking changes !

#### Especially database related stuff

##### and the api itself...

## About

REST api for NavigoLearning. This project is built with Node.js, Express, and
MariaDB.

## Documentation

- [API endpoint reference](./docs/api_reference/README.md)
- [Internal documentation](./docs/internal/README.md)
- [Contributing guidelines](./CONTRIBUTING.md)
- [Code of conduct](./CODE_OF_CONDUCT.md)

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