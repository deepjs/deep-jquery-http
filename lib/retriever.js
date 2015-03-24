/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 * Base Class for http client that has only a "get" method. Useful for template engine loader.
 *
 * Example :
 * define(["require", "deepjs/deep", "deep-http/lib/jquery/retriever"], function(require, deep)
 * 
 */
define(["require", "deepjs/deep", "deepjs/lib/cache", "deep-restful/lib/store"], function(require, deep, cache, Store){
	var Retriever = deep.Classes(Store, function(protocol, basePath, options) {
		this.basePath = basePath || this.basePath || "";
		if (options)
			deep.up(this, options);
	}, {
		writeHeaders: function(req, headers) {
			for (var i in deep.globalHeaders)
				req.setRequestHeader(i, deep.globalHeaders[i]);
			for (var i in deep.currentApp().headers)
				req.setRequestHeader(i, deep.currentApp().headers[i]);
			for (i in this.headers)
				req.setRequestHeader(i, this.headers[i]);
			for (i in headers)
				req.setRequestHeader(i, headers[i]);
		},
		responseParser: function(data) {
			return data;
		},
		headers:{
			"Accept": "text/html; charset=utf-8"
		},
		get: function(id, opt) {
			opt = opt || {};
			id = this.basePath + id;
			deep.utils.decorateBottomFrom(this, opt, ["cache","cachePath"]);
			if (opt.cache !== false)
			{
				opt.cacheName = opt.cacheName || id;
				opt.cachePath = opt.cachePath || this.protocol || "no-name-space";
			 	var cached = cache.get(opt.cachePath, opt.cacheName);
				if(cached)
					if(cached.then)
						return deep.when(cached);
					else
						return cached;
			}
			var self = this;
			var prom = new deep.Promise();
			var promise = deep.$().ajax({
				beforeSend: function(req) {
					self.writeHeaders(req, opt.headers);
				},
				url: id,
				method: "GET"
			})
			.done(function(data, msg, jqXHR) {
				prom.resolve(self.responseParser(data));
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				prom.reject(deep.errors.Error(jqXHR.status, "http client (jquery) call failed : " + id, errorThrown));
			});
			if (options.cache !== false)
				cache.add(prom, opt.cachePath, opt.cacheName);
			return prom;
		}
	});
	return Retriever;
});