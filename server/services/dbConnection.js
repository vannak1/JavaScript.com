// TODO: I'll need to configure these settings for however Mongo would handle
// things.
//
// var settings = process.env.DATABASE_URL;

// if (settings == undefined) {
//   settings = "pg://localhost:5432/javascriptcom";
// }

// if (process.env.NODE_ENV === 'production') {
//   pg.defaults.ssl = true;
// }

var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;

exports.connect = function() {
  if (mongo.DB) return mongo.DB;

  // TODO - replace with process.env
  MongoClient.connect('mongodb://localhost:27017/jscom', function(err, db) {

    if (err) {
      console.log('Unable to connect to Mongo.');
      process.exit(1);
    } else {
      console.log('Connected to Mongo.');
      mongo.DB = db;
    }
  });
}

