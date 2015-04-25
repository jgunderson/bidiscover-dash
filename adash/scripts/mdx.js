'use strict';

angular.module('erpbi-mdx', [])
    .service('Mdx', function($location, $http){ 

		this.execute = function(templates, callBack) {
		  var collections = [],
		  //
		  // Sometimes there is /#/ and sometimes a / at the end of the URL to strip off	
		  //
		  theUrl = $location.absUrl().replace("/#/", ""),
		  baseUrl;
		  
		if (theUrl.substring(theUrl.length - 1, theUrl.length) == "/") {
		  baseUrl = theUrl.substring(0, theUrl.length - 1) + "/xmla?format=application/json&mdx=";
		  }
		else {
		  baseUrl = theUrl + "/xmla?format=application/json&mdx=";
		}		  
        _.each(templates, function () {
          collections.push({queryComplete: false, result: ""});
        });		  
		  
	    _.each(templates, function(template, index){

			$http.get(baseUrl + encodeURIComponent(template.query)).
			  success(function(data, status, headers, config) {
                var allComplete = true;
				collections[index].queryComplete = true;
				collections[index].result = data;
                _.each(collections, function (coll) {
                  allComplete = allComplete && coll.queryComplete;
                });
                if (allComplete) {
				  callBack(collections);
                }
			  }).
			  error(function(data, status, headers, config) {
				$rootScope.error = 'Failed to signin';
				$log.info('mdx query failed: ' + status);
			  });
		});	  

	  };	
    }
);