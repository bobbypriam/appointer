// module dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var routes = require('./routes');
var session = require('./configs/session');
var baseurl = require('./configs/baseurl');
var mailer = require('./configs/mailer');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);
app.use(baseurl);
app.use(mailer);
app.use(express.static(path.join(__dirname, '../public')));

// route mapping
app.use('/', routes);

// models

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
        res.render(err.status == 404 ? '404' : 'error', {
            title: err.status + ' | Appointer',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render(err.status == 404 ? '404' : 'error', {
        title: err.status + ' | Appointer',
        message: err.message,
        error: {}
    });
});


module.exports = app;
