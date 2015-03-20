var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = require('./app');

var jsonBodyParser = bodyParser.json();

function loadRoute(routePath, defaultMount){
	var route = require(routePath);
	var mount = route.route || defaultMount;
	for(var method in route){
		if(method === 'get'){
			app[method](mount, route[method]);
		}else if(method !== 'route'){
			app[method](mount, jsonBodyParser, route[method]);
		}
	}
}

function loadDirRecurs(fullPath, mount){
	fs.readdirSync(fullPath).forEach(function(file){
		var filePath = path.join(fullPath, file);
		var stats = fs.statSync(filePath);
		if(stats.isFile()){
			if(file.substr(-3) === '.js'){
				if(file === 'index.js'){
					loadRoute(filePath, mount);
				}else{
					loadRoute(filePath, mount + file.substr(0, file.length-3));
				}
			}
		}else if(stats.isDirectory()){
			loadDirRecurs(filePath, mount + file + '/');
		}
	});
}

module.exports = function(routesPath){
	loadDirRecurs(path.resolve(routesPath), '/');
};