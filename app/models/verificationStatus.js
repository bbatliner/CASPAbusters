'use strict';

var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

// Schema =============================

var verificationStatusSchema = mongoose.Schema({
     mathProblem:    { type: Boolean, default: false },
     snowshoe:       { type: Boolean, default: false }
});

verificationStatusSchema.plugin(timestamps);


// Expose model to application
module.exports = mongoose.model('VerificationStatus', verificationStatusSchema);
