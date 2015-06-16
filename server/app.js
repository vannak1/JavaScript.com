var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
// Global, it's used everywhere
path = require('path');

// Set baseURL depending on enviornment

var env = process.env.NODE_ENV;
if (env === 'production') {
  baseURL = "https://www.javascript.com/";
}else if(env === 'staging'){
  baseURL = "http://javascript.preschool.io/";
}else{
  baseURL = "http://localhost:3000/";
}

var routes = require(path.join(__dirname, 'routes','index'));

var about = require(path.join(__dirname, 'routes', 'about'));
var admin = require(path.join(__dirname, 'routes', 'admin'));
var assets = require(path.join(__dirname, 'routes', 'assets'));
var courses = require(path.join(__dirname, 'routes', 'courses'));
var feed = require(path.join(__dirname, 'routes', 'feed'));
var feedback = require(path.join(__dirname, 'routes', 'feedback'));
var guidelines = require(path.join(__dirname, 'routes', 'guidelines'));
var learn = require(path.join(__dirname, 'routes', 'learn'));
var news = require(path.join(__dirname, 'routes', 'news'));
var notFound = require(path.join(__dirname, 'routes', 'notFound'));
var resources = require(path.join(__dirname, 'routes', 'resources'));
var styleguide = require(path.join(__dirname, 'routes', 'styleguide'));
var users = require(path.join(__dirname, 'routes', 'users'));

var app = express();
app.set('trust proxy', 1);

// Must come before calls to app.use
var passport = require('passport');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var redis = require('redis');
var redisHost = process.env.REDIS_HOST === undefined ? '127.0.0.1' : process.env.REDIS_HOST;
var client = redis.createClient(6379, redisHost, {});
// Don't set cookies to secure in dev.
var secureCookie = process.env.NODE_ENV === 'production' ? true : false
app.use(expressSession({
  store: new RedisStore({client: client}),
  secret: 'asd9fjasdflmasdf98u543mlsaffasdf9787asdflkjmfsdalasfdjasdfiuhwqerl'
}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Flash messages
app.use(require('flash')());

// routes
app.use('/', routes);
app.use('/about', about);
app.use('/admin', admin);
app.use('/assets', assets);
app.use('/courses', courses)
app.use('/courses.json', courses);
app.use('/feed', feed);
app.use('/feedback', feedback);
app.use('/guidelines', guidelines)
app.use('/news', news);
app.use('/resources', resources)
app.use('/styleguide', styleguide);
app.use('/try', learn)
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 404) {
        res.render('404');
    }else{
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

module.exports = app;

// Set absolute paths for partials
app.locals.basedir = path.join(__dirname, '');
