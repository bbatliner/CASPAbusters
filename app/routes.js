var Request = require(global.modelsDir + '/request.js');

module.exports = function(app) {

	// ===============================
	// API ENDPOINTS =================
	// ===============================	

	// POST ==========================
	app.post('/request/new', function(req, res) {
		var earliestWakeTime = req.body.earliestWakeTime;
		var latestWakeTime = req.body.latestWakeTime;
		var hall = req.body.hall;
		var wing = req.body.wing;
		var name = req.body.name;
		var message = req.body.message;

		// Everything is required except for message
		if (!earliestWakeTime || !latestWakeTime || !hall || !wing || !name) {
			return res.status(400).send('All inputs are required except for message.');
		}

		// Earliest wake time and latest wake time must be in the future
		var now = new Date().getTime();
		if (now > earliestWakeTime || now > latestWakeTime) {
			return res.status(400).send('Wake times must be in the future.');
		}

		// Earliest wake time must be less than latest wake time
		if (earliestWakeTime > latestWakeTime) {
			return res.status(400).send('Earliest wake time must be less than latest wake time.');
		}

		var newRequest = new Request({
			'earliestWakeTime': earliestWakeTime,
			'latestWakeTime': latestWakeTime,
			'hall': hall,
			'wing': wing,
			'name': name,
			'message': message
		});
		newRequest.save(function(err) {
			if (err) {
				return res.status(500).send('Unable to save request.');
			}
			return res.sendStatus(200);
		});
	});

	// ===============================
	// PAGE ROUTES ===================
	// ===============================

	app.get('/', function(req, res) {
		res.sendFile(global.serveDir + '/index.html');
	});
};