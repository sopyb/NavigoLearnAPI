# Navigo Learn API <!-- [![CodeFactor](https://www.codefactor.io/repository/github/navigolearn/api/badge/master)](https://www.codefactor.io/repository/github/navigolearn/api/overview/master) -->

## ! This is a work in progress !

### ! Expect breaking changes !

#### Especially database related stuff

##### and the api itself...

## About

REST api for NavigoLearning. This project is built with Node.js, Express, and
MariaDB.

## Documentation

Documentation for the api can be found [here](docs/paths/README.md).

## Available Scripts

### `npm run dev`

Run the server in development mode.

### `npm test`

Run all unit-tests with hot-reloading.

### `npm test -- --testFile="name of test file" (i.e. --testFile=Users).`

Run a single unit-test.

### `npm run test:no-reloading`

Run all unit-tests without hot-reloading.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.

## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to
  run: `npm rebuild bcrypt --build-from-source`. 
