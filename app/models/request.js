var mongoose    = require('mongoose');
var timestamps  = require('mongoose-timestamp');


// Schema =============================

var requestSchema = mongoose.Schema({
	// NEEDS TO HAVE THE PEERID OF THE BROWSER
	earliestWakeTime:        Date,
	latestWakeTime:          Date,
	hall:                    String,
	wing:                    String,
	name:                    String,
	message:                 String,
	callStatus:              Object
	/* callStatus: {
		status: {standby/active/completed},
		verify1Completed: {true/false},
		verify2Completed: {true/false}
	} */
});

requestSchema.plugin(timestamps);


// Methods ============================

requestSchema.methods.isInTimeRange = function() {
	// MongoDB stores `Date`s in Unix timestamp format,
	// so this is the format we use to compare the dates
	var now = new Date().getTime();
	console.log('Now: ', now);
	console.log('Earliest2: ', this.earliestWakeTime);
	return this.earliestWakeTime < now && now < this.latestWakeTime;
};


// Expose model to application
module.exports = mongoose.model('Requests', requestSchema);