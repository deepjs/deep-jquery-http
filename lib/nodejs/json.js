/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
"use strict";

var deep = require("deepjs"),
	HTTP = require("deep-restful/lib/http"),
	cacheSheet = require("deep-restful/lib/cache-sheet"),
	httpCall = require("./http-call");



var client = {
	responseParser: function(data) {
		try {
			if (typeof data === 'string')
				data = JSON.parse(data);
		} catch (e) {
			return e;
		}
		return data;
	},
	bodyParser: function(data) {
		try {
			if (typeof data !== 'string')
				data = JSON.stringify(data);
		} catch (e) {
			return e;
		}
		return data;
	},
	get: function(id, options) {
		return httpCall.call(this, id, null, "GET", options);
	},
	post: function(uri, body, options) {
		//console.log("node.json call : post : ", uri, body, options);
		return httpCall.call(this, uri, body, "POST", options);
	},
	put: function(uri, body, options) {
		return httpCall.call(this, uri, body, "PUT", options);
	},
	patch: function(uri, body, options) {
		return httpCall.call(this, uri, body, "PATCH", options);
	},
	del: function(id, options) {
		return httpCall.call(this, id, null, "DELETE", options);
	},
	range: function(start, end, uri, options) {
		var self = this;
		//console.log("RANGE uri = ", uri);
		options = options || {};
		options.fullResponse = true;
		return httpCall.call(this, uri, null, "GET", options)
			.done(function(data) {
				//console.log("Data -----------", data)
				var res = {
					status: data.status,
					contentRange: data.headers["content-range"],
					data: self.responseParser(data.body)
				};
				return res;
			});
	},
	rpc: function(uri, body, options) {
		return httpCall.call(this, uri, body, "POST", options);
	},
	bulk: function(uri, body, options) {
		return httpCall.call(this, uri, body, "POST", options);
	}
};

deep.nodejs = deep.nodejs || {};
deep.nodejs.http = deep.nodejs.http || {};
deep.nodejs.http.JSON = deep.Classes(client, HTTP, cacheSheet);

deep.coreUnits = deep.coreUnits || [];
deep.coreUnits.push("deep-node/units/http-json");

module.exports = deep.nodejs.http.JSON;