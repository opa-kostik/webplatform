var express         = require('express');
var session         = require("express-session");
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
// var seed            = require("./seed_db");

var mongoose     = require("mongoose");
mongoose.Promise = require('bluebird');

var passport    = require("passport");
var LocalStrategy = require("passport-local");

//models
var User        = require("./models/user");
var app = express();

var dbUrl = process.env.DBURL || "mongodb://localhost/test_base";
mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Here be dragons",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for setting user
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//seed DB with some initial entries
// seed();

//requiring routes
var serviceRoutes     = require('./routes/services');
var blogpostRoutes    = require('./routes/blogposts');
var categoryRoutes    = require('./routes/categories');
var indexRoutes       = require('./routes/index');
var userRoutes        = require('./routes/users');

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);
app.use('/blogposts', blogpostRoutes);
app.use('/categories', categoryRoutes);

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