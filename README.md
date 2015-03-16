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
Compile and watch Sass with `$ gulp`.

For debugging all the things, run `DEBUG=* npm start`.

## Development

If you add any runtime dependencies, you must run `npm shrinkwrap` and
commit changes to `npm-shrinkwrap.json`.

