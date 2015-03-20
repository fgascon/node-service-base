var EventEmitter = require('events').EventEmitter;
var RedisEventEmitter = require('redis-events').EventEmitter;
var config = require('s-conf');
var levelup = require('levelup');
var sublevel = require('level-sublevel');
var express = require('express');

var app = require('./lib/app');
var server = require('./lib/server');
var routesLoader = require('./lib/routes-loader');
var defaultErrorHandler = require('./lib/default-error-handler');

module.exports = function(options){
	var api = {};
	api.config = config;
	api.app = app;
	api.server = server;
	
	if(options.db !== false){
		var dbOptions = options.db || {};
		api.db = sublevel(levelup(config.require('db'), dbOptions));
	}
	
	if(options.redis !== false){
		var messageBus = api.messageBus = new RedisEventEmitter(config.get('redis', {}));
		api.redis = messageBus.publisher = messageBus.createClient();
	}else{
		api.messageBus = new EventEmitter();
	}
	
	api.static = function(mount, path){
		app.use(mount, express.static(path));
	};
	
	api.loadRoutes = routesLoader;
	api.useDefaultErrorHandlers = defaultErrorHandler;
	
	return api;
};