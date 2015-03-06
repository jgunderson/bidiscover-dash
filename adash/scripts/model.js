/*
 *
 * Copyright (c) 2015, Jeff Gunderson
 * Refer to included license
 *
 */
'use strict';

angular.module('erpbi-model', ['adf', 'LocalStorageModule'])

  .service('Model', function(localStorageService, $rootScope, $http, $location) {
    this.factory = function(name, user) {
	  //var model = localStorageService.get(name);
	  var model = null;
	  
	  if (!model) {
		// set default model for demo purposes
		model = {
		  user: user,
		  name: name,
		  id: "",
		  title: "Getting Started",
		  structure: "12/6-6",
		  rows: [{
			columns: [{
			  styleClass: "col-md-12",
			  widgets: [ {
				type: "markdown",
				config: {
				  content: "![logo](/src/styles/logo.png)\n\nTo design a dashboard you can edit this Getting Started Dashboard or select the + tab to create a new dasboard.  Then select the edit icon.  This gives you a choice to:\n\n* Add a Widget\n* Edit the Dashboard\n* Save Changes\n* Undo Changes\n\nAfter selecting a Widget you have options to:\n\n* Change the Widget Location\n* Edit Widget Configuration\n* Remove Widget\nOnce you are happy with the dashboard, don't forget to save it!"
				},
				title: ""
			  }]
			}]
		  }]      
		};
	  }
	  
	  return model;
	}
		
    this.store = function(model, atStoreComplete) {
		var baseUrl = $location.absUrl().replace("/#/", "");
		$http.post(baseUrl + '/saveModel', {id: model.id, model: model}).
			success(function(data, status, headers, config) {
				atStoreComplete(data.id);
			}).
			error(function(data, status, headers, config) {
				$rootScope.error = 'Model save error: ' + status;
			});  
		}
		
    this.findModels = function(user, atFindComplete) {
		var baseUrl = $location.absUrl().replace("/#/", "");
		$http.post(baseUrl + '/findModels', {user: user}).
			success(function(data, status, headers, config) {
			  if(atFindComplete) {
				atFindComplete(data);
			  }
			}).
			error(function(data, status, headers, config) {
				$rootScope.error = 'Models find error: ' + status;
			});  
		}
  });
