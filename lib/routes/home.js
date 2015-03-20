var path = require('path');

function getEntryDirPath(){
	var current = module;
	while(current.parent){
		current = current.parent;
	}
	return path.dirname(current.filename);
}

var pkg = require(getEntryDirPath() + '/package.json');
var serviceManifest = {
	name: pkg.name,
	version: pkg.version
};

exports.get = function(req, res, next){
	res.json(serviceManifest);
};