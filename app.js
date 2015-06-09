var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

// Set baseURL depending on enviornment
var env = process.env.NODE_ENV;
if (env === 'production') {
  baseURL = "https://javascript.com/";
}else if(env === 'staging'){
  baseURL = "http://javascript.preschool.io/";
}else{
  baseURL = "http://localhost:3000/";
}

var routes = require('./routes/index');

var about = require('./routes/about');
var admin = require('./routes/admin');
var assets = require('./routes/assets');
var courses = require('./routes/courses');
var feed = require('./routes/feed');
var feedback = require('./routes/feedback');
var guidelines = require('./routes/guidelines');
var learn = require('./routes/learn');
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
// Don't set cookies to secure in dev.
var secureCookie = process.env.NODE_ENV === 'production' ? true : false
app.use(expressSession({
  store: new RedisStore({client: client}),
  secret: 'replace-me-with-secret-key',
  cookie: {secure: secureCookie}
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
