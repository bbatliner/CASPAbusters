'use strict';

// Define directory constants
global.rootDir = __dirname;
global.serveDir = __dirname + '/app';
global.modelsDir = __dirname + '/app/models';
global.configDir = __dirname + '/config';

// Require dependencies
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compression = require('compression');

// Setup MongoDB
require(global.configDir + '/mongoose.js');

// Setup Express server
var app = express();

// Parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing browser cookies

// Logging
app.use(morgan('dev'));

// Serving
app.use(compression()); // Use compression (gzip)
app.use(express.static(global.serveDir)); // Serve static files, not rendered templates

// Routes
require('./app/routes.js')(app);

// Launch server
var server = app.listen(process.env.PORT || 5000, '0.0.0.0', function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://' + host + ':' + port);
});
