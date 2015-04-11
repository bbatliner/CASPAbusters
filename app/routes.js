module.exports = function(app) {

	

	// ===============================
	// PAGE ROUTES ===================
	// ===============================

	app.get('/', function(req, res) {
		res.sendFile(global.serveDir + '/index.html');
	});
};