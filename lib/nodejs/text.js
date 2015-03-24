/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
	var deep = require("deepjs");
	var HttpJSON = require("./json");

	deep.nodejs.http.Text = deep.Classes(HttpJSON, {
		headers:{
			"Accept" : "text/html; charset=utf-8"
        },
        dataType:"html",
        bodyParser : function(data){
            if(typeof data === 'string')
                return data;
            if(data.toString())
                return data.toString();
            return String(data);
        },
        responseParser : function(data, msg, jqXHR){
           return data.toString();
        }
	});
	module.exports = deep.nodejs.http.Text;

