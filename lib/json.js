/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
"use strict";
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["require", "deepjs/deep", "deep-restful/lib/http"], function(require, deep, HTTP) {

	deep.jquery = deep.jquery || {};
	deep.jquery.http = deep.jquery.http ||  {};
	/**
	 * TODO : patch/put with query
	 *
	 * manage redirections
	 */
	var writeHeaders = function(req, headers) {
		for (var i in deep.globalHeaders)
			req.setRequestHeader(i, deep.globalHeaders[i]);
		for (var i in deep.currentApp().headers)
			req.setRequestHeader(i, deep.currentApp().headers[i]);
		for (i in this.headers)
			req.setRequestHeader(i, this.headers[i]);
		for (i in headers)
			req.setRequestHeader(i, headers[i]);
	};

	var ajaxCall = function(uri, body, method, options) {
		// console.log("ajax call : ", uri, body, method);
		if (body instanceof Error)
			return body;
		var prom = new deep.Promise();
		var self = this;
		var toSend = {
			beforeSend: function(req) {
				writeHeaders.call(self, req, options ? options.headers : null);
			},
			url: uri,
			type: method,
			method: method
		};
		if (body !== null) {
			toSend.dataType = options.dataType || this.dataType || "json";
			toSend.data = this.parseBody(body);
		}
		$.ajax(toSend)
			.done(function(data, msg, jqXHR) {
				prom.resolve(self.responseParser(data, msg, jqXHR));
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				if (jqXHR.status < 400)
					prom.resolve(self.responseParser(jqXHR.responseText));
				else
					prom.reject(deep.errors.Error(jqXHR.status, textStatus));
			});
		return prom;
	};

	var client = {
		dataType: "json",
		cache: false,
		responseParser: function(data) {
			return data;
		},
		parseBody: function(data) {
			try {
				//if(typeof data !== 'string')
				data = JSON.stringify(data);
			} catch (e) {
				return e;
			}
			return data;
		},
		get: function(id, options) {
			return ajaxCall.call(this, id, null, "GET", options);
		},
		post: function(uri, body, options) {
			return ajaxCall.call(this, uri, body, "POST", options);
		},
		put: function(uri, body, options) {
			return ajaxCall.call(this, uri, body, "PUT", options);
		},
		patch: function(uri, body, options) {
			return ajaxCall.call(this, uri, body, "PATCH", options);
		},
		del: function(id, options) {
			return ajaxCall.call(this, id, null, "DELETE", options);
		},
		options: function(uri, options) {
			uri = uri || "*";
			// console.log("jquery.ajax.OPTIONS : ", uri, options);
			return ajaxCall.call(this, uri, null, "OPTIONS", options);
		},
		head: function(uri, options) {
			uri = uri || "/";
			return ajaxCall.call(this, uri, null, "HEAD", options);
		},
		range: function(start, end, uri, options) {
			//console.log("jquery json range uri : ", uri);
			var prom = new deep.Promise();
			var self = this;
			$.ajax({
					beforeSend: function(req) {
						writeHeaders(req, options.headers);
					},
					url: uri,
					method: "GET"
				})
				.done(function(data, msg, jqXHR) {
					var res = {
						status: jqXHR.status,
						contentRange: jqXHR.getResponseHeader("content-range"),
						data: self.responseParser(data, msg, jqXHR)
					};
					prom.resolve(res);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					if (jqXHR.status < 400) {
						var res = {
							status: jqXHR.status,
							contentRange: jqXHR.getResponseHeader("content-range"),
							data: self.responseParser(jqXHR.responseText, textStatus, jqXHR)
						};
						prom.resolve(res);
					} else
						prom.reject(deep.errors.Error(jqXHR.status, textStatus));
				});
			return prom;
		},
		rpc: function(uri, body, options) {
			return ajaxCall.call(this, uri, body, "POST", options);
		},
		bulk: function(uri, body, options) {
			return ajaxCall.call(this, uri, body, "POST", options);
		}
	};
	deep.jquery.http.JSON = deep.Classes(client, HTTP);
	return deep.jquery.http.JSON;
});