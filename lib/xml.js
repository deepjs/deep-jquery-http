/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "./json"], function(require, deep, jsonStore) {
	deep.jquery.http.XML = deep.Classes(jsonStore, {
		headers: {
			"Accept": "application/xml; charset=utf-8",
			"Content-Type": "application/xml; charset=utf-8"
		},
		dataType: "xml",
		bodyParser: function(data) {
			if (typeof data === 'string')
				return data;
			if (data.toString())
				return data.toString();
			return String(data);
		},
		responseParser: function(data, msg, jqXHR) {
			return jQuery.parseXML(data);
		}
	});
	//__________________________________________________
	return deep.jquery.http.XML;

});