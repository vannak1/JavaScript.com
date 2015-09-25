var path = require('path');
var config = require(path.join(__dirname, '..', '..', 'config'));
var pg = require("pg");
var settings = config.server.database;

if (config.server.environment === 'production') {
  pg.defaults.ssl = true;
}

/* A parameterized query. An empty args array may be passed if there are no paramaters.
 * Results are passed to a callback.
 *
 * Ex:
 * db.query('SELECT * FROM episodes WHERE title ILIKE $1', ['%'+ keyword +'%'],
 *   function (episodes) {
 *     return cb(episodes);
 *   }
 * );
 */
var query = function (parameterizedString, args, cb) {
  pg.connect(settings, function (err, client, done) {
    client.query(parameterizedString, args, function (err, result) {
      if (err) throw err;
      done();
      cb(result.rows);
    })
  });
}

module.exports = {
  query: query
};
