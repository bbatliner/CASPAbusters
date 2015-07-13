'use strict';

var mongoose    = require('mongoose');
var timestamps  = require('mongoose-timestamp');

// Schema =============================

var requestSchema = mongoose.Schema({
    peerId:                  String,
    phoneNumber:             String,
    earliestWakeTime:        Date,
    latestWakeTime:          Date,
    hall:                    String,
    wing:                    String,
    name:                    String,
    message:                 String,
    // TODO: Find a way to verify the structure of this object (perhaps with another model and ref?)
    verificationStatus:              Object
    /* callStatus: {
        mathProblem: {true/false},
        snowshow: {true/false}
    } */
});

requestSchema.plugin(timestamps);


// Methods ============================

requestSchema.methods.isInTimeRange = function() {
    // Convert all the dates to Unix timestamps in milliseconds for easy comparison
    var now = new Date().getTime();
    return new Date(this.earliestWakeTime).getTime() < now && now < new Date(this.latestWakeTime).getTime();
};


// Expose model to application
module.exports = mongoose.model('Requests', requestSchema);
