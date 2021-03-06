/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, console:true, issue:true, require:true, XM:true, io:true,
Backbone:true, _:true, X:true, __dirname:true, exports:true */

(function () {
  "use strict"

	var mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  UserSchema = new Schema({
		email: String,
		password: String,
		token: String
	  });

	module.exports = mongoose.model('User', UserSchema);

}());