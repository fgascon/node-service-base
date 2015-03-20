var app = require('./app');

module.exports = function(){
	app.use(function notFound(req, res, next){
		res.status(404).json({
			error: "Not found"
		});
	});

	app.use(function errorHandler(err, req, res, next){
		res.status(500).json({
			error: (err && err.message) || String(err)
		});
	});
};