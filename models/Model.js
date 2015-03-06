/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, console:true, issue:true, require:true, XM:true, io:true,
Backbone:true, _:true, X:true, __dirname:true, exports:true */

(function () {
  "use strict"

	var mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
		/*
		 *  Dashboard models.  The id, name and user are saved within the model
		 *  as the framework just gives the model in $scope.$on('adfDashboardChanged'
		 */
	  ModelSchema = new Schema({
		user: String,
		model: {}
	  });

	module.exports = mongoose.model('Model', ModelSchema, 'Model');

}());