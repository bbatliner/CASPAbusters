var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI, function(err) {
	if (err) {
		console.log('MongoDB connection error: ' + err);
	}
});

var db = mongoose.connection;
db.once('open', function (data) {
	console.log("MongoDB connection successful.");
});

module.exports = db;