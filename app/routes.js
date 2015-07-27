'use strict';

var Request = require(global.modelsDir + '/request.js');
var VerificationStatus = require(global.modelsDir + '/verificationStatus.js');

module.exports = function (app) {

    // ===============================
    // API ENDPOINTS =================
    // ===============================

    // POST ==========================

    app.post('/request/new', function (req, res) {
        var earliestWakeTime = req.body.earliestWakeTime;
        var latestWakeTime = req.body.latestWakeTime;
        var hall = req.body.hall;
        var wing = req.body.wing;
        var name = req.body.name;
        var message = req.body.message;
        var phoneNumber = req.body.phoneNumber;
        var peerId = req.body.peerId;

        // Everything is required except for message
        if (!earliestWakeTime || !latestWakeTime || !hall || !wing || !name) {
            return res.status(400).send('All inputs are required except for message.');
        }

        // Either a phone number or peer id is required
        if (!(peerId || phoneNumber)) {
            return res.status(400).send('A phone number or peer ID is required.');
        }

        // Earliest wake time and latest wake time must be in the future
        var now = new Date().getTime();
        if (now > earliestWakeTime || now > latestWakeTime) {
            return res.status(400).send('Wake times must be in the future.');
        }

        // Earliest wake time must be less than latest wake time
        if (earliestWakeTime > latestWakeTime) {
            return res.status(400).send('Earliest wake time must be before latest wake time.');
        }

        var temp = new VerificationStatus();
        temp.save(function (error, verificationStatus) {
            if (error) {
                return res.status(500).send('Unable to create new request.');
            }

            var newRequest = new Request({
                'earliestWakeTime': earliestWakeTime,
                'latestWakeTime': latestWakeTime,
                'hall': hall,
                'wing': wing,
                'name': name,
                'message': message,
                'verificationStatus': verificationStatus,
                // One of these could be undefined - an undefined property does not get saved in MongoDB
                'peerId': peerId,
                'phoneNumber': phoneNumber
            });
            newRequest.save(function (err) {
                if (err) {
                    return res.status(500).send('Unable to save request.');
                }
                return res.status(200).json({id: newRequest._id});
            });
        });
    });

    app.post('/request/verify/1', function (req, res) {
        var id = req.body.id;

        if (id === null || id === undefined) {
            return res.status(400).send('id is required.');
        }

        Request.findById(id, function (error, request) {
            if (error) {
                return res.status(404).send('Unable to find request with that id.');
            }
            request.populate('verificationStatus', function (error, request) {
                request.verificationStatus.mathProblem = true;
                request.verificationStatus.save(function (error) {
                    if (error) {
                        return res.status(500).send('Unable to update request status.');
                    }
                    return res.sendStatus(200);
                });
            });
        });
    });

    app.post('/request/delete', function (req, res) {
        var id = req.body.id;

        if (id === null || id === undefined) {
            return res.status(400).send('id is required.');
        }

        Request.findByIdAndRemove(id, function (error) {
            if (error) {
                return res.status(500).send('Unable to delete request.');
            }
            return res.sendStatus(200);
        });
    });

    // GET ===========================

    app.get('/request/all', function (req, res) {
        Request.find({}, function (error, requests) {
            if (error) {
                return res.status(404).send('Unable to retrieve requests.');
            }
            return res.status(200).json(requests);
        });
    });

    app.get('/request/available', function (req, res) {
        Request.find({}, function (error, requests) {
            if (error) {
                return res.status(404).send('Unable to retrieve available requests');
            }
            var availableRequests = [];
            requests.forEach(function (request) {
                if (request.isInTimeRange()) {
                    availableRequests[availableRequests.length] = request;
                }
            });
            return res.status(200).json(availableRequests);
        });
    });

    // ===============================
    // PAGE ROUTES ===================
    // ===============================

    app.get('/', function (req, res) {
        res.sendFile(global.serveDir + '/index.html');
    });
};