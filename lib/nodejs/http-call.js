/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
"use strict";

var deep = require("deepjs"),
	url = require('url'),
	http = require('http');

module.exports = function(uri, datas, method, options) {
	//console.log("HTTPCall URI : ", uri, "datas : ", datas, "method : ", method);
	options = options || {};
	var def = new deep.Promise();
	var response = {
		status: null,
		body: null,
		headers: null
	};
	var infos = url.parse(uri);
	infos.headers = options.headers;
	infos.method = method;
	//console.log("http req : send : ", infos);
	if (datas) {
		var stringifiedDatas = JSON.stringify(datas);
		infos.headers['Content-Length'] = stringifiedDatas.length;
	}

	var maxRedirections = options.maxRedirections || 10;
	try {
		var req = http.request(infos, function(res) {
			//console.log("http req : response : ");
			response.status = res.statusCode;
			response.headers = res.headers;
			response.body = '';
			res.setEncoding('utf8');
			var er = false;
			res.on('data', function(chunk) {
				//console.log("json response : on data : ", chunk);
				response.body += chunk.toString();
			});
			res.on("end", function() {
				//console.log("json response : on end : ", er);
				if (er)
					return;
				try {
					response.body = deep.utils.parseBody(response.body, response.headers);
					if (response.status >= 400 && !def.rejected)
						def.reject(deep.errors.Error(response.status, response.body));
					else
						def.resolve((options.fullResponse) ? response : response.body);
				} catch (e) {
					if (!def.rejected)
						def.reject(e);
				}
			});
			res.on('error', function(e) {
				er = e;
				console.error("deep-node/lib/http/json : error : ", e);
				if (!def.rejected)
					def.reject(e);
			});
		});
		req.on('error', function(e) {
			console.error("deep-node/lib/http/json : error : ", e);
			def.reject(e);
		});
		if (datas)
			req.write(stringifiedDatas);
		req.end();
	} catch (e) {
		//deep.utils.dumpError(e);
		if (!def.rejected)
			def.reject(e);
	}
	return def;
};