/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, console:true, issue:true, require:true, XM:true, io:true,
Backbone:true, _:true, X:true, __dirname:true, exports:true */

(function () {
  "use strict"

	var config = {
	  port: 8124,
	  sport: 8125,
	  mongoUrl: 'mongodb://127.0.0.1:27017/test',
	  biUrl: 'http://ubuntu64:8080/pentaho/Xmla?userid=admin-default.dev&password=admin'
	};

	exports.config = config;

}());