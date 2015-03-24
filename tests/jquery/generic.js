/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 */
 
if(typeof define !== 'function')
	var define = require('amdefine')(module);

define(["require", "deepjs/deep", "deepjs/lib/unit"], function genericAjaxTestCaseDefine(require){

	var unit = {
		title:"deep-jquery-ajax/units/generic"
	};

	return unit;
});
