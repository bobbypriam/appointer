#!/usr/bin/env node

var app = require('./app');
var debug = require('debug')('appointer:server');
var http = require('http');
var models = require('./models');

var port = process.env.PORT || '3000';
app.set('port', port);

models.sequelize.sync().then(function () {

  var server = http.createServer(app);
  server.listen(port);
  console.log("Express app started, listening on port", port);

});