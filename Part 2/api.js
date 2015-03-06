var Weather = {
	host: 'http://weather.developersguild.net/',
	handlers: [],
	getForecast: function(state, city, callback) {
		var handler = function(err, data) {
			if(err) {
				callback(err, null)
			} else if ( !data
				 || !data.forecast
				 || !data.forecast.simpleforecast
				 || !(data.forecast.simpleforecast.forecastday instanceof Array)
				  ) {
				callback("Malformed response", data);
			} else {
				callback(null, data.forecast.simpleforecast.forecastday, data);
			}

		};
		Weather.handlers.push(handler);
		var handlerId = Weather.handlers.length - 1;
		var jsonpScript = document.createElement('script');
		jsonpScript.type = 'text/javascript';
		jsonpScript.src  = Weather.host + 'tenDay/' + state + '/' + city + '/Weather.handlers[' + handlerId + '].js';
		document.getElementsByTagName('head')[0].appendChild(jsonpScript);
	}
}
