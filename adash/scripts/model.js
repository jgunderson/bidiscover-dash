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
		  title: "New Dashboard",
		  structure: "4-8",
		  rows: [{
			columns: [{
			  styleClass: "col-md-4",
			  widgets: [{
				type: "linklist",
				config: {
				  links: [{
					title: "SCM-Manager",
					href: "http://www.scm-manager.org"
				  }, {
					title: "Github",
					href: "https://github.com"
				  }, {
					title: "Bitbucket",
					href: "https://bitbucket.org"
				  }, {
					title: "Stackoverflow",
					href: "http://stackoverflow.com"
				  }]
				},
				title: "Links"
			  }, {
				type: "weather",
				config: {
				  location: "Hildesheim"
				},
				title: "Weather Hildesheim"
			  }, {
				type: "weather",
				config: {
				  location: "Edinburgh"
				},
				title: "Weather"
			  }, {
				type: "weather",
				config: {
				  location: "Dublin,IE"
				},
				title: "Weather"
			  }]
			}, {
			  styleClass: "col-md-8",
			  widgets: [{
				type: "randommsg",
				config: {},
				title: "Douglas Adams"
			  }, {
				type: "markdown",
				config: {
				  content: "![scm-manager logo](https://bitbucket.org/sdorra/scm-manager/wiki/resources/scm-manager_logo.jpg)\n\nThe easiest way to share and manage your Git, Mercurial and Subversion repositories over http.\n\n* Very easy installation\n* No need to hack configuration files, SCM-Manager is completely configureable from its Web-Interface\n* No Apache and no database installation is required\n* Central user, group and permission management\n* Out of the box support for Git, Mercurial and Subversion\n* Full RESTFul Web Service API (JSON and XML)\n* Rich User Interface\n* Simple Plugin API\n* Useful plugins available ( f.e. Ldap-, ActiveDirectory-, PAM-Authentication)\n* Licensed under the BSD-License"
				},
				title: "Markdown"
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
