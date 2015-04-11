// Define directory constants
global.rootDir     = __dirname;
global.serveDir    = __dirname + '/app';

// Require dependencies
var morgan         = require('morgan');
var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var compression    = require('compression');

// Setup MongoDB
// require(global.configDir + '/mongoose.js');

// Setup Express server
var app = express();

// Parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Serving
app.use(compression());
app.use(express.static(global.serveDir));

// Routes
require('./app/routes.js')(app);

// Launch server
app.listen(process.env.PORT || 5000);
