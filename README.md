# Users API

A simple users CRUD.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to have the following installed:
* [Git](https://git-scm.com/downloads) - Git download page
* [Node.js](https://nodejs.org/en/download/) - Node.js download page
* [MongoDB](https://www.mongodb.com/try/download/community) - MongoDB download page

It is strongly recommended to install them in their latest version.

### Installing

To have a functional development or testing environment, do the following (assuming you are using Linux):

```
mkdir users_api
cd users_api/
git clone https://github.com/daniel382/users_crud.git .
```

create an .env file like the following:

```
echo HOST=\"127.0.0.1\" >> .env
echo PORT=\"3535\" >> .env
echo MONGO_URL=\"mongodb://127.0.0.1:27017/users_api\" >> .env
```

after that, create a secret.json file, like this:

```
mkdir src/config
echo {\"secret\": \"any secret you want\"} >> src/config/secret.json
```

and finally:

```
yarn
```

or

```
npm install
```

## Running the application

To run this app, simply type:

```
yarn start
```

or

```
npm start
```

## Running the tests

There are three ways to run tests

### Unit tests

Run unit tests by:

```
yarn test:unit
```

or

```
npm run test:unit
```

### Integration tests

Run integration tests by:

```
yarn test:integration
```

or

```
npm run test:integration
```

Due to the use of an in-memory database, some tests may fail. If that happens, just run the tests again.

### Continuous integration tests

These are a complete suit of tests, including unit and integration tests and coverage.
Running continuous integration tests by:

```
yarn test:ci
```

or

```
npm run test:ci
```

## Online demo

To see this app running, start send a POST HTTP request [here](https://users-api-360.herokuapp.com/signup) with body:

```
{
  "name": "you user name",
  "email: "you_user@email.com",
  "password": "you password",
  "repeatPassword": "you password",
}
```

## Authors

* **Daniel Lucas** - *current maintainer* - [daniel382](https://github.com/daniel382/)

## License

This project is licensed under the *GNU General Public License v3.0* License - see the [LICENSE](LICENSE) file for details
