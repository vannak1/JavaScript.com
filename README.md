# JavaScript.com

This is the repo for the JavaScript.com website.

## Running

* Install dependencies with `$ npm install`.
* Create the local PostgreSQL database with `$ createdb javascriptcom`.
* Load schema with `$ psql javascriptcom < db/schema.sql`
* Run the application with `$ npm start`.

For debugging all the things, run `DEBUG=* npm start`.

## Development

If you add any runtime dependencies, you must run `npm shrinkwrap` and
commit changes to `npm-shrinkwrap.json`.

