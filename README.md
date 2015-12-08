# JavaScript.com

This is the repo for the JavaScript.com website.

## Installing NVM

Install NVM (`$ brew install nvm` and follow instructions)

```bash
nvm install iojs-v1.2.0
nvm use iojs-v1.2.0
npm install -g gulp
npm install
```

This app authenticates with GitHub, so you'll need to create a GitHub Application and set ENVs for `GH_CLIENT_ID` and `GH_CLIENT_SECRET`.

## Running

Run the application with `$ npm start`. You can also set the environment variables at start time. Here's an example:

```bash
$ GH_CLIENT_ID=myid GH_CLIENT_SECRET=mysecret npm start
```

For debugging all the things, run `DEBUG=* npm start`.

## Database
Download and install [MongoDB](https://www.mongodb.org/downloads)

When you run `npm start`, mongod will be forked as a background process. No need
to create the database either. You're all set.

## Development

If you add any runtime dependencies, you must run `npm shrinkwrap` and
commit changes to `npm-shrinkwrap.json`.

### Building Assets

To build assets locally, you'll need to install Bower dependencies and run these Gulp tasks:

```bash
$ bower install
$ gulp sass
$ gulp javascript
```

Remember to re-run these tasks after pulling or changing branches.
