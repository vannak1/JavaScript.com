# JavaScript.com

This is the repo for the JavaScript.com website.

## Installing NVM

Install NVM (`$ brew install nvm` and follow instructions)

```bash
nvm install iojs-v2.0.1
nvm use iojs-v2.0.1
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
Whenever you do the initial `npm install` a db called `javascriptcom` is created
for you. In the event that you need to drop that database and recreate it, don't
forget to either run `npm install` again or `createdb javascriptcom`

NPM will run new migrations whenever you `npm start`. In order for it to work,
you'll need to set the `DATABASE_URL` ENV to pg://localhost:5432/javascriptcom.
Migrations are already run for you after the initial `npm install`

To create new migrations see the node-pg-migraton
[documentation](https://github.com/theoephraim/node-pg-migrate).

After setting your database up run `gulp seeds` to seed your database.
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
