/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
"use strict";

var deep = require("deepjs"),
	httpCall = require("./http-call"),
	cacheSheet = require("deep-restful/lib/cache-sheet");


var client = {
	responseParser: function(data) {
		if (datas instanceof Buffer)
			datas = datas.toString("utf8");
		return data;
	},
	get: function(id, options) {
		return httpCall.call(this, id, null, "GET", options);
	}
};

module.exports =  deep.compose.Classes(client, cacheSheet);
