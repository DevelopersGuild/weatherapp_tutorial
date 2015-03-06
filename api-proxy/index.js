var request = require('request');
var express = require('express');

var app = express();

var api_key = process.env.WU_API_KEY;
var api_url = 'https://api.wunderground.com/api/';

var cache = {
	tenDay : {}
};

var requestTenDay = function(state, city, callback) {
	var cacheEntry = cache.tenDay[state] ? cache.tenDay[state][city] : undefined

	if(!cacheEntry || Date.now() - cacheEntry.timestamp > 1000 * 60) {

		var url = api_url + api_key + '/forecast10day/q/' + state + '/' + city + '.json';
		console.log("Making request to " + url)

		request(url, function(err, res, body) {

			cache.tenDay[state] = cache.tenDay[state] || {};
			cache.tenDay[state][city] = cache.tenDay[state][city] || {};

			cache.tenDay[state][city].data = body;
			cache.tenDay[state][city].timestamp = Date.now();

			return typeof callback === 'function' && callback(err, res, body);
		});
	} else {
		console.log("Using cache entry for " + city + ", " + state);
		return typeof callback === 'function' && callback(null, null, cacheEntry.data);
	}
};

app.get('/tenDay/:state/:city/:jsonp.js', function(req, res) {
		requestTenDay(req.params.state, req.params.city, function(err, response, body) {
			res.type('application/javascript');
			if(err){
				return res.send(req.params.jsonp + '("Unknown error occurred")');
			}
			return res.send(req.params.jsonp + '(null, ' + body + ');');
		});
});

app.get('/tenDay/', function(req, res) {
		var state = req.query.state;
		var city = req.query.city;
		var jsonp = req.query.callback;

		if(!state || !city) {
			return res.code(400);
		}

		requestTenDay(state, city, function(err, response, body) {
			if(err){
				if(jsonp) {
					res.type('application/javascript');
					return res.send(req.params.jsonp + '("Unknown error occurred")');
				} else {
					return res.code(400);
				}
			}

			if(jsonp) {
				res.type('application/javascript');
				res.send(jsonp + '(null, ' + body + ');');
			} else {
				res.type('json');
				res.send(body);
			}
		});
});

app.listen(3000);
