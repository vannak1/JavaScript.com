var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

baseURL = (process.env.NODE_ENV === 'production' ? "http://173.255.212.131:3000/" : "http://localhost:3000/");

var routes = require('./routes/index');

var brand = require('./routes/brand');
var courses = require('./routes/courses');
var learn = require('./routes/learn');
var guidelines = require('./routes/guidelines');
var news = require('./routes/news');
var notFound = require('./routes/notFound');
var resources = require('./routes/resources');
var styleguide = require('./routes/styleguide');
var users = require('./routes/users');

var app = express();

// Must come before calls to app.use
var passport = require('passport');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var redis = require('redis');
var client = redis.createClient();
app.use(expressSession({
  store: new RedisStore({client: client}),
  secret: 'replace-me-with-secret-key'
}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Flash messages
app.use(require('flash')());

// routes
app.use('/', routes);
app.use('/404', notFound)
app.use('/brand', brand);
app.use('/courses', courses)
app.use('/courses.json', courses);
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
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

// Set absolute paths for partials
app.locals.basedir = path.join(__dirname, '');
